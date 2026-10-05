export interface VerificationInstructions {
    type: string;
    name: string;
    value: string;
    method: string;
    url_path?: string;
    meta_tag?: string;
    header_name?: string;
    cname_target?: string;
}

export interface Website {
    website_id: number;
    original_url: string;
    normalized_hostname: string;
    registrable_domain: string;
    verification: VerificationInstructions;
    status: string;
    verification_method: string;
    recommended_method: string;
    available_methods: string[];
    expires_at: string;
}

export interface VerifyResponse {
    verified: boolean;
    status: string;
    method: string;
    message?: string;
}
