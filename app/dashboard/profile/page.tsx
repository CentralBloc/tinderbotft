import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {Metadata} from "next";
import ProfilePager from "@/components/pages/profile-page";

export const metadata: Metadata = {
	title: "Dashboard - Profile",
	description: "Dashboard profile page",
};

export default function ProfilePage() {
	return (
		<div className="space-y-5">
			<Breadcrumbs segments={[{ title: "Profile" }]} />
			<ProfilePager />
		</div>
	);
}
