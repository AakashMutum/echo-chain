import { Profile } from "@/lib/types"

export function getUserDisplayName(profile: Profile | null, fallbackWallet?: string | null): string {
    if (profile?.name) {
        return profile.name
    }

    const wallet = profile?.wallet_address || fallbackWallet

    if (wallet) {
        return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    }

    return "Unknown"
}

export function getUserInitials(profile: Profile | null): string {
    if (profile?.name) {
        return profile.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }
    return "?"
}
