import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "@/components/ui/expandable-screen"
import ProfileForm from "./profile-form"

export default function ExpandableCard() {
  return (
    <ExpandableScreen
      layoutId="cta-card"
      triggerRadius="100px"
      contentRadius="24px"
    >
      <div className="flex min-h-screen items-center justify-center">
        <ExpandableScreenTrigger>
          <button className="bg-primary px-6 py-3 text-primary-foreground">
            Open Screen
          </button>
        </ExpandableScreenTrigger>
      </div>

      <ExpandableScreenContent className="bg-black text-white">
        <div className="flex h-full items-center justify-center p-8">
          <ProfileForm />
        </div>
      </ExpandableScreenContent>
    </ExpandableScreen>
  )
}