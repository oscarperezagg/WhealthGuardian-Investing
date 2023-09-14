import { Separator } from "@/components/ui/separator"
import { NotificationsForm } from "./notifications_form"

export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Downloader</h3>
        <p className="text-sm text-muted-foreground">
          Configure downloader options.
        </p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  )
}