interface Patron {
    readonly currently_entitled_amount_cents: number;
    readonly full_name: string;
    readonly is_follower: boolean;
    readonly last_charge_date: string | null;
    readonly last_charge_status: "Paid" | "Declined" | "Deleted" | "Pending" | "Refunded" | "Fraud" | "Other" | null;
    readonly lifetime_support_cents: number;
    readonly patron_status: "active_patron" | "declined_patron" | "former_patron" | null;
    readonly pledge_relationship_start: string | null;
    readonly will_pay_amount_cents: number;
    readonly image_url: string;
}
