import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const Modal = ({ trigger, header, children }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>
                    {header}
                </DialogTitle>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default Modal