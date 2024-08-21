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
} from "@/components/ui/alert-dialog"

interface DialogProps {
  trigger?: React.ReactNode,
  description?: string,
  title?: string,
  cancel?: React.ReactNode,
  action?: React.ReactNode,
  onConfirm?: () => void; 
  onCancel?: () => void; 
  actionButtonClass: string,
  cancelButtonClass: string
}

const Dialog = ( { trigger, description, title, cancel, action, onConfirm, onCancel, cancelButtonClass, actionButtonClass }: DialogProps ) => {
  return (
  <AlertDialog>
  <AlertDialogTrigger asChild >{trigger}</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{title}</AlertDialogTitle>
      <AlertDialogDescription>{description}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={onCancel} className={cancelButtonClass}>{cancel}</AlertDialogCancel>
      <AlertDialogAction onClick={onConfirm} className={actionButtonClass}>{action}</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}

export default Dialog