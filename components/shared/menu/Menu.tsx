import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={props.href || "#"}
          passHref
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function Menu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuItems.map((menu) => (
          <NavigationMenuItem key={menu.name}>
            <NavigationMenuTrigger>{menu.name}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4">
                {menu.items.map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <Link href="/profile" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              My Profile
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const userMenu: menuItem[] = [
  {
    title: "Create User",
    href: "/users/create",
    description:
      "Create a new user account. You can create a user account for a new user.",
  },
  {
    title: "View Users",
    href: "/users",
    description:
      "View all user accounts. You can view all user accounts and their details.",
  },
];

const courseMenu: menuItem[] = [
  {
    title: "Create Course",
    href: "/courses/create",
    description: "Create a new course. You can create a course for a new user.",
  },
  {
    title: "View Courses",
    href: "/courses",
    description:
      "View all courses. You can view all courses and their details.",
  },
];

const organMenu: menuItem[] = [
  {
    title: "Create Organ",
    href: "/organs/create",
    description: "Create a new organ. You can create a organ for a new user.",
  },
  {
    title: "View Organs",
    href: "/organs",
    description: "View all organs. You can view all organs and their details.",
  },
];

const workMenu: menuItem[] = [
  {
    title: "View Works",
    href: "/works",
    description: "View all works. You can view all works and their details.",
  },
];

const menuItems: menu[] = [
  {
    name: "Users",
    items: userMenu,
  },
  {
    name: "Courses",
    items: courseMenu,
  },
  {
    name: "Organs",
    items: organMenu,
  },
  {
    name: "Works",
    items: workMenu,
  },
];

interface menu {
  name: string;
  items: menuItem[];
}

interface menuItem {
  title: string;
  href: string;
  description: string;
}
