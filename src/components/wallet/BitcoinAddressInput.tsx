import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2, Wallet, XCircle, ArrowRight, Zap, Bitcoin } from "lucide-react";
import { validate as validateBtc } from "bitcoin-address-validation";
import { isAddress as isAddressBsc } from "viem";
import { cn } from "@/lib/utils";

type Network = "btc" | "bsc";

interface ValidationResult {
    isValid: boolean;
    message?: string;
}

interface BitcoinAddressInputProps {
    onSuccess?: (address: string, network: Network) => void;
}

export default function BitcoinAddressInput({ onSuccess }: BitcoinAddressInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [network, setNetwork] = useState<Network>("btc"); // Default to Bitcoin
    const [address, setAddress] = useState("");
    const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: false });
    const [networkConflict, setNetworkConflict] = useState<string | null>(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setAddress("");
            setValidationResult({ isValid: false });
            setNetworkConflict(null);
            setNetwork("btc");
        }
    }, [isOpen]);

    // Real-time analysis and validation
    useEffect(() => {
        const trimmedAddress = address.trim();

        if (!trimmedAddress) {
            setValidationResult({ isValid: false });
            setNetworkConflict(null);
            return;
        }

        // Auto-detection / Suggestion Logic
        // 0x... -> BSC
        // 1..., 3..., bc1... -> BTC
        const isPotentiallyBsc = trimmedAddress.startsWith("0x");
        const isPotentiallyBtc =
            trimmedAddress.startsWith("1") ||
            trimmedAddress.startsWith("3") ||
            trimmedAddress.toLowerCase().startsWith("bc1");

        // Network Conflict Warning
        if (network === "btc" && isPotentiallyBsc) {
            setNetworkConflict("Cette adresse ressemble à une adresse BSC (Binance Smart Chain).");
        } else if (network === "bsc" && isPotentiallyBtc) {
            setNetworkConflict("Cette adresse ressemble à une adresse Bitcoin.");
        } else {
            setNetworkConflict(null);
        }

        // Validation Logic
        if (network === "btc") {
            const isValidBtc = validateBtc(trimmedAddress);
            if (isValidBtc) {
                setValidationResult({ isValid: true });
            } else {
                // bitcoin-address-validation checks checksums. 
                // We can infer error types if we wanted to process `getAddressInfo` exceptions, 
                // but validate() returns false on simple failure.
                // For better UX, we can assume if it looks like BTC but fails, it's a checksum/typo.
                setValidationResult({
                    isValid: false,
                    message: isPotentiallyBtc ? "Adresse corrompue ou faute de frappe (Checksum invalide)" : "Format d'adresse Bitcoin invalide"
                });
            }
        } else if (network === "bsc") {
            const isValidBsc = isAddressBsc(trimmedAddress);
            if (isValidBsc) {
                setValidationResult({ isValid: true });
            } else {
                setValidationResult({
                    isValid: false,
                    message: isPotentiallyBsc && trimmedAddress.length !== 42
                        ? "Longueur incorrecte (42 caractères attendus)"
                        : "Adresse BSC invalide"
                });
            }
        }

    }, [address, network]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Auto-trim spaces
        const val = e.target.value.trim();
        setAddress(val);
    };

    const handleNetworkChange = (value: string) => {
        setNetwork(value as Network);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full h-auto py-6 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900 rounded-2xl flex justify-between items-center group shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-col items-start ml-2 text-left">
                        <span className="font-semibold text-xl mb-1">Saisir une adresse existante</span>
                        <span className="text-slate-500 font-medium">Compatible Bitcoin & Binance Smart Chain (WIT)</span>
                    </div>
                    <div className="bg-slate-100 p-3 rounded-full group-hover:bg-slate-200 transition-colors mr-2">
                        <Zap className="h-6 w-6 text-slate-600 group-hover:scale-110 transition-transform" />
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Wallet className="h-6 w-6 text-slate-600" />
                        Saisir une adresse
                    </DialogTitle>
                    <DialogDescription>
                        Saisir un wallet en lecture seule ou pour une transaction.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Network Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700">Réseau</Label>
                        <RadioGroup
                            defaultValue="btc"
                            value={network}
                            onValueChange={handleNetworkChange}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="btc" id="btc" className="peer sr-only" />
                                <Label
                                    htmlFor="btc"
                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-orange-50 hover:border-orange-200 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 cursor-pointer transition-all group"
                                >
                                    <Bitcoin className="h-8 w-8 mb-3 text-slate-400 group-hover:text-orange-500 peer-data-[state=checked]:text-orange-500 transition-colors" />
                                    <span className="font-semibold text-sm text-slate-900 group-hover:text-orange-700 peer-data-[state=checked]:text-orange-900">Bitcoin</span>
                                    <span className="text-xs text-slate-500">BTC</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="bsc" id="bsc" className="peer sr-only" />
                                <Label
                                    htmlFor="bsc"
                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-yellow-50 hover:border-yellow-200 peer-data-[state=checked]:border-yellow-500 peer-data-[state=checked]:bg-yellow-50 cursor-pointer transition-all group"
                                >
                                    <Zap className="h-8 w-8 mb-3 text-slate-400 group-hover:text-yellow-500 peer-data-[state=checked]:text-yellow-500 transition-colors" />
                                    <span className="font-semibold text-sm text-slate-900 group-hover:text-yellow-700 peer-data-[state=checked]:text-yellow-900">Binance Smart Chain</span>
                                    <span className="text-xs text-slate-500">WIT</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Address Input */}
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                            Adresse du wallet
                        </Label>
                        <div className="relative">
                            <Input
                                id="address"
                                placeholder={network === 'btc' ? "Ex: 1A1zP1eP5QGefi2DPTfTL5SLmv7DivfNa" : "Ex: 0x71C765..."}
                                value={address}
                                onChange={handleInputChange}
                                className={cn(
                                    "pr-10 transition-colors h-12 font-mono text-sm",
                                    validationResult.isValid && "border-green-500 focus-visible:ring-green-500",
                                    !validationResult.isValid && address && "border-red-300 focus-visible:ring-red-300"
                                )}
                                aria-invalid={!validationResult.isValid && address !== ""}
                            />
                            <div className="absolute right-3 top-3.5">
                                {validationResult.isValid && (
                                    <CheckCircle2 className="h-5 w-5 text-green-500 animate-in zoom-in" />
                                )}
                                {!validationResult.isValid && address && (
                                    <XCircle className="h-5 w-5 text-red-500 animate-in zoom-in" />
                                )}
                            </div>
                        </div>

                        {/* Error / Warning Messages */}
                        <div className="min-h-[20px]" aria-live="polite">
                            {networkConflict && (
                                <div className="flex items-center gap-2 text-amber-600 text-xs mt-1 bg-amber-50 p-2 rounded animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{networkConflict}</span>
                                    <Button
                                        variant="link"
                                        className="h-auto p-0 text-amber-700 underline text-xs ml-1"
                                        onClick={() => setNetwork(network === 'btc' ? 'bsc' : 'btc')}
                                    >
                                        Changer ?
                                    </Button>
                                </div>
                            )}

                            {!validationResult.isValid && address && !networkConflict && validationResult.message && (
                                <div className="flex items-center gap-2 text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{validationResult.message}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Annuler
                    </Button>
                    <Button
                        disabled={!validationResult.isValid}
                        className={cn(
                            "transition-all",
                            validationResult.isValid ? "bg-green-600 hover:bg-green-700" : "bg-slate-900"
                        )}
                        onClick={() => {
                            if (onSuccess) {
                                onSuccess(address, network);
                            }
                            setIsOpen(false);
                        }}
                    >
                        Confirmer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
