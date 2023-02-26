import { CogIcon, HomeIcon, UserGroupIcon, UserCircleIcon, PencilIcon, GlobeAltIcon } from "@heroicons/vue/24/outline";

type Where = "home" | "app" | "admin";

type Navigation = {
  name: string;
  to: string;
  icon: any;
};

export function getNavigation(where: Where): Navigation[] {
  switch (where) {
    case "home":
      return [
        { name: "Home", to: "/", icon: HomeIcon },
        { name: "Pricing", to: "/pricing", icon: HomeIcon },
        { name: "Contact", to: "/contact", icon: HomeIcon },
      ];
    case "app":
      return [
        { name: "Feed", to: "/app/feed", icon: HomeIcon },
        { name: "Community", to: "/app/community", icon: GlobeAltIcon },
        { name: "Profile", to: "/app/profile/" + useUserStore().getUser?.id, icon: UserCircleIcon },
        { name: "Edit Profile", to: "/app/edit-profile", icon: PencilIcon },
        { name: "Settings", to: "/app/settings", icon: CogIcon },
      ];
    case "admin":
      return [
        { name: "Dashboard", to: "/app/admin/dashboard", icon: UserGroupIcon },
        { name: "App Management", to: "/app/admin/app-management", icon: CogIcon },
      ];
  }
}
