import { Website } from "@/types/website";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DnsInstructions({ website, onVerify, verifying }: { website: Website, onVerify: () => void, verifying: boolean }) {
    const [copiedName, setCopiedName] = useState(false);
    const [copiedValue, setCopiedValue] = useState(false);

    const copyText = (text: string, setter: (val: boolean) => void) => {
        navigator.clipboard.writeText(text);
        setter(true);
        setTimeout(() => setter(false), 2000);
    };

    return (
        <div className="space-y-6">
            <p className="text-[var(--foreground)] font-medium">
                Add this TXT record to your DNS provider:
            </p>

            <div className="bg-muted p-4 rounded-md border space-y-4">
                <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Type</div>
                    <div className="font-mono bg-card px-3 py-2 rounded border">{website.verification.type}</div>
                </div>

                <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Name</div>
                    <div className="flex items-center gap-2">
                        <div className="font-mono bg-card px-3 py-2 rounded border flex-1 overflow-auto">
                            {website.verification.name}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => copyText(website.verification.name, setCopiedName)}>
                            {copiedName ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                </div>

                <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Value</div>
                    <div className="flex items-center gap-2">
                        <div className="font-mono bg-card px-3 py-2 rounded border flex-1 overflow-auto break-all">
                            {website.verification.value}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => copyText(website.verification.value, setCopiedValue)}>
                            {copiedValue ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="text-sm text-[var(--foreground)] space-y-1">
                <p>1. Open your DNS provider</p>
                <p>2. Create the TXT record</p>
                <p>3. Save it</p>
                <p>4. Return here</p>
                <p>5. Click Verify Domain</p>
            </div>

            <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white mt-4 py-6 text-lg" 
                onClick={onVerify}
                disabled={verifying}
            >
                {verifying ? "Checking DNS..." : "Verify Domain"}
            </Button>
        </div>
    );
}
