import {
  Bot, Boxes, Briefcase, Building2, ChartNoAxesCombined, CheckCircle2, Cloud,
  Code2, Database, FileText, Globe2, Heart, Headphones, Image as ImageIcon,
  Layers3, LayoutDashboard, Lightbulb, LockKeyhole, Mail, MessageCircle,
  MonitorSmartphone, Palette, PenTool, Phone, Rocket, Search, Server, Settings,
  ShieldCheck, ShoppingCart, Smartphone, Sparkles, Star, Users, Workflow, Zap,
  type LucideIcon,
} from 'lucide-react';

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  Code2, ShoppingCart, Building2, LayoutDashboard, MonitorSmartphone, Workflow,
  Sparkles, Globe2, Database, Smartphone, Palette, ShieldCheck, Rocket, Settings,
  Layers3, Server, Cloud, Zap, Users, MessageCircle, Mail, Phone, Search,
  ChartNoAxesCombined, Heart, Star, Lightbulb, Headphones, LockKeyhole, PenTool,
  FileText, ImageIcon, Briefcase, Bot, Boxes, CheckCircle2,
};

export function getServiceIcon(name?: string): LucideIcon {
  return SERVICE_ICONS[name || ''] || Code2;
}
