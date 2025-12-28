import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { getUserProfileByEmail, getDemoUserProfile } from "@/lib/mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ProfileHeader,
  BioCard,
  PersonalInfoCard,
  SocialLinksCard,
  ContactInfoCard,
  StatisticsCards,
  ActivityMetricsCard,
} from "../components/profile";
import { EditProfileModal } from "../components/profile/EditProfileModal";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userProfile = user?.email
    ? getUserProfileByEmail(user.email) || getDemoUserProfile()
    : getDemoUserProfile();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your public profile and account information
        </p>
      </div>

      {/* Profile Header with Cover & Avatar */}
      <ProfileHeader
        userProfile={userProfile}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <BioCard bio={userProfile.bio} />
            <PersonalInfoCard userProfile={userProfile} />
            <SocialLinksCard userProfile={userProfile} />
          </div>
        </TabsContent>

        {/* Contact Info Tab */}
        <TabsContent value="contact" className="space-y-6">
          <ContactInfoCard userProfile={userProfile} />
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <StatisticsCards userProfile={userProfile} />
          <ActivityMetricsCard userProfile={userProfile} />
        </TabsContent>
      </Tabs>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        userProfile={userProfile}
      />
    </div>
  );
}
