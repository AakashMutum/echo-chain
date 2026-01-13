// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DecisionRegistry
 * @notice On-chain registry for EchoChain decision version hashes
 * @dev Stores content hashes for immutable audit trail
 */
contract DecisionRegistry {
    struct Version {
        bytes32 contentHash;
        bytes32 previousHash;
        string ipfsCid;
        address editor;
        uint256 timestamp;
    }

    // decisionId => array of versions
    mapping(bytes32 => Version[]) public decisionVersions;
    
    // decisionId => exists
    mapping(bytes32 => bool) public decisionExists;
    
    // Events
    event DecisionCreated(bytes32 indexed decisionId, address indexed creator, uint256 timestamp);
    event VersionRecorded(
        bytes32 indexed decisionId,
        uint256 versionNumber,
        bytes32 contentHash,
        bytes32 previousHash,
        address indexed editor,
        uint256 timestamp
    );

    /**
     * @notice Record a new version for a decision
     * @param decisionId Unique identifier for the decision (UUID converted to bytes32)
     * @param contentHash SHA-256 hash of the decision content
     * @param previousHash Hash of the previous version (bytes32(0) for first version)
     * @param ipfsCid Optional IPFS CID for full content storage
     */
    function recordVersion(
        bytes32 decisionId,
        bytes32 contentHash,
        bytes32 previousHash,
        string calldata ipfsCid
    ) external {
        // If first version, mark decision as created
        if (!decisionExists[decisionId]) {
            decisionExists[decisionId] = true;
            emit DecisionCreated(decisionId, msg.sender, block.timestamp);
        }

        uint256 versionNumber = decisionVersions[decisionId].length + 1;

        // Verify chain integrity for non-first versions
        if (versionNumber > 1) {
            Version memory lastVersion = decisionVersions[decisionId][versionNumber - 2];
            require(previousHash == lastVersion.contentHash, "Previous hash mismatch");
        }

        Version memory newVersion = Version({
            contentHash: contentHash,
            previousHash: previousHash,
            ipfsCid: ipfsCid,
            editor: msg.sender,
            timestamp: block.timestamp
        });

        decisionVersions[decisionId].push(newVersion);

        emit VersionRecorded(
            decisionId,
            versionNumber,
            contentHash,
            previousHash,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Get the number of versions for a decision
     * @param decisionId The decision identifier
     * @return Number of versions recorded
     */
    function getVersionCount(bytes32 decisionId) external view returns (uint256) {
        return decisionVersions[decisionId].length;
    }

    /**
     * @notice Get a specific version of a decision
     * @param decisionId The decision identifier
     * @param versionIndex Zero-based index of the version
     * @return contentHash The content hash
     * @return previousHash The previous version's hash
     * @return ipfsCid The IPFS CID
     * @return editor The address that recorded this version
     * @return timestamp When the version was recorded
     */
    function getVersion(bytes32 decisionId, uint256 versionIndex)
        external
        view
        returns (
            bytes32 contentHash,
            bytes32 previousHash,
            string memory ipfsCid,
            address editor,
            uint256 timestamp
        )
    {
        require(versionIndex < decisionVersions[decisionId].length, "Version does not exist");
        Version memory v = decisionVersions[decisionId][versionIndex];
        return (v.contentHash, v.previousHash, v.ipfsCid, v.editor, v.timestamp);
    }

    /**
     * @notice Verify a content hash matches a recorded version
     * @param decisionId The decision identifier
     * @param versionIndex Zero-based index of the version
     * @param contentHash The hash to verify
     * @return True if the hash matches
     */
    function verifyHash(
        bytes32 decisionId,
        uint256 versionIndex,
        bytes32 contentHash
    ) external view returns (bool) {
        if (versionIndex >= decisionVersions[decisionId].length) {
            return false;
        }
        return decisionVersions[decisionId][versionIndex].contentHash == contentHash;
    }

    /**
     * @notice Get the latest version of a decision
     * @param decisionId The decision identifier
     * @return contentHash The content hash
     * @return previousHash The previous version's hash
     * @return ipfsCid The IPFS CID
     * @return editor The address that recorded this version
     * @return timestamp When the version was recorded
     */
    function getLatestVersion(bytes32 decisionId)
        external
        view
        returns (
            bytes32 contentHash,
            bytes32 previousHash,
            string memory ipfsCid,
            address editor,
            uint256 timestamp
        )
    {
        uint256 length = decisionVersions[decisionId].length;
        require(length > 0, "No versions exist");
        Version memory v = decisionVersions[decisionId][length - 1];
        return (v.contentHash, v.previousHash, v.ipfsCid, v.editor, v.timestamp);
    }
}
