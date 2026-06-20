import {
  CalendarDays,
  Gift,
  Mail,
  MapPin,
  MessageCircleHeart,
  Music,
  Phone,
  Play,
  UsersRound
} from "lucide-react";
import type { SVGProps } from "react";

type PlatformIconProps = SVGProps<SVGSVGElement>;

export function PlatformCalendarIcon(props: PlatformIconProps) {
  return <CalendarDays aria-hidden="true" focusable="false" {...props} />;
}

export function PlatformGiftIcon(props: PlatformIconProps) {
  return <Gift aria-hidden="true" focusable="false" {...props} />;
}

export function PlatformMailIcon(props: PlatformIconProps) {
  return <Mail aria-hidden="true" focusable="false" {...props} />;
}

export function PlatformMapPinIcon(props: PlatformIconProps) {
  return <MapPin aria-hidden="true" focusable="false" {...props} />;
}

export function PlatformMessageIcon(props: PlatformIconProps) {
  return <MessageCircleHeart aria-hidden="true" focusable="false" {...props} />;
}

export function PlatformMusicIcon(props: PlatformIconProps) {
  return <Music aria-hidden="true" focusable="false" {...props} />;
}

export function PlatformPhoneIcon(props: PlatformIconProps) {
  return <Phone aria-hidden="true" focusable="false" {...props} />;
}

export function PlatformPlayIcon(props: PlatformIconProps) {
  return <Play aria-hidden="true" focusable="false" {...props} />;
}

export function PlatformUsersIcon(props: PlatformIconProps) {
  return <UsersRound aria-hidden="true" focusable="false" {...props} />;
}
