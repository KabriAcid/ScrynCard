import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BioCardProps {
  bio?: string;
}

export function BioCard({ bio }: BioCardProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>Bio and background information</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">
          {bio || "No bio available. Click Edit Profile to add your bio."}
        </p>
      </CardContent>
    </Card>
  );
}
