import { useStore } from "@nanostores/react";
import { LockIcon, UnlockIcon } from "lucide-react";
import { useRef, useState } from "react";
import { VscChevronDown, VscShare, VscTrash } from "react-icons/vsc";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from "@/components/ui/sidebar-l";
import { useTranslation } from "@/i18n";
import { isLoading, questions } from "@/lib/context";
import { cn } from "@/lib/utils";

export const QuestionCard = ({
    children,
    questionKey,
    className,
    label,
    sub,
    collapsed,
    locked,
    setLocked,
    setCollapsed,
}: {
    children: React.ReactNode;
    questionKey: number;
    className?: string;
    label?: string;
    sub?: string;
    collapsed?: boolean;
    locked?: boolean;
    setLocked?: (locked: boolean) => void;
    setCollapsed?: (collapsed: boolean) => void;
}) => {
    const t = useTranslation();
    const [isCollapsed, setIsCollapsed] = useState(collapsed ?? false);
    const $questions = useStore(questions);
    const $isLoading = useStore(isLoading);
    const copyButtonRef = useRef<HTMLButtonElement>(null);

    const toggleCollapse = () => {
        if (setCollapsed) {
            setCollapsed(!isCollapsed);
        }
        setIsCollapsed((prevState) => !prevState);
    };

    return (
        <>
            <SidebarGroup className={className}>
                <div className="relative">
                    <button
                        onClick={toggleCollapse}
                        className={cn(
                            "absolute top-2 left-2 text-white border rounded-md transition-all duration-500",
                            isCollapsed && "-rotate-90",
                        )}
                    >
                        <VscChevronDown />
                    </button>
                    <SidebarGroupLabel
                        className="ml-8 mr-8 cursor-pointer"
                        onClick={toggleCollapse}
                    >
                        {label} {sub && `(${sub})`}
                    </SidebarGroupLabel>
                    <SidebarGroupContent
                        className={cn(
                            "overflow-hidden transition-all duration-1000 max-h-[100rem]", // 100rem is arbitrary
                            isCollapsed && "max-h-0",
                        )}
                    >
                        <SidebarMenu>{children}</SidebarMenu>
                        <div className="flex gap-2 pt-2 px-2 justify-center">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <VscShare />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl">
                                            {t("questionCard.share.title")}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {t(
                                                "questionCard.share.description",
                                            )}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mb-2 sm:mb-0 transition-colors"
                                        ref={copyButtonRef}
                                        onClick={() => {
                                            navigator.clipboard
                                                .writeText(
                                                    JSON.stringify(
                                                        $questions.find(
                                                            (q) =>
                                                                q.key ===
                                                                questionKey,
                                                        ),
                                                        null,
                                                        4,
                                                    ),
                                                )
                                                .then(() => {
                                                    if (copyButtonRef.current) {
                                                        copyButtonRef.current.textContent =
                                                            t(
                                                                "questionCard.share.copied",
                                                            );
                                                        copyButtonRef.current.classList.add(
                                                            "bg-green-500",
                                                        );
                                                        setTimeout(() => {
                                                            if (
                                                                copyButtonRef.current
                                                            ) {
                                                                copyButtonRef.current.textContent =
                                                                    t(
                                                                        "questionCard.share.copy",
                                                                    );
                                                                copyButtonRef.current.classList.remove(
                                                                    "bg-green-500",
                                                                );
                                                            }
                                                        }, 2000);
                                                    }
                                                })
                                                .catch(() => {
                                                    if (copyButtonRef.current) {
                                                        copyButtonRef.current.textContent =
                                                            t(
                                                                "questionCard.share.failed",
                                                            );
                                                        copyButtonRef.current.classList.add(
                                                            "bg-red-500",
                                                        );
                                                        setTimeout(() => {
                                                            if (
                                                                copyButtonRef.current
                                                            ) {
                                                                copyButtonRef.current.textContent =
                                                                    t(
                                                                        "questionCard.share.copy",
                                                                    );
                                                                copyButtonRef.current.classList.remove(
                                                                    "bg-red-500",
                                                                );
                                                            }
                                                        }, 2000);
                                                    }
                                                });
                                        }}
                                    >
                                        {t("questionCard.share.copy")}
                                    </Button>
                                    <textarea
                                        className="w-full h-[300px] bg-slate-900 text-white rounded-md p-2"
                                        readOnly
                                        value={JSON.stringify(
                                            $questions.find(
                                                (q) => q.key === questionKey,
                                            ),
                                            null,
                                            4,
                                        )}
                                    ></textarea>
                                </DialogContent>
                            </Dialog>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={$isLoading}
                                    >
                                        <VscTrash />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            {t("questionCard.delete.title")}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {t(
                                                "questionCard.delete.description",
                                            )}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            {t("common.cancel")}
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => {
                                                questions.set([]);
                                            }}
                                        >
                                            {t(
                                                "questionCard.delete.confirmAll",
                                            )}
                                        </AlertDialogAction>
                                        <AlertDialogAction
                                            onClick={() => {
                                                questions.set(
                                                    $questions.filter(
                                                        (q) =>
                                                            q.key !==
                                                            questionKey,
                                                    ),
                                                );
                                            }}
                                            className="mb-2 sm:mb-0"
                                        >
                                            {t(
                                                "questionCard.delete.confirmOne",
                                            )}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            {locked !== undefined && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setLocked!(!locked)}
                                    disabled={$isLoading}
                                >
                                    {locked ? <LockIcon /> : <UnlockIcon />}
                                </Button>
                            )}
                        </div>
                    </SidebarGroupContent>
                </div>
            </SidebarGroup>
            <Separator className="h-1" />
        </>
    );
};
