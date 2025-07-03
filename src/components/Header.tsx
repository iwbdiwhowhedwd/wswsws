
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Crown, Star, Gem } from "lucide-react";

interface AppInfo {
  title: string;
  description: string;
  vision: string;
  mission: string;
  history: string;
  features: string;
}

interface HeaderProps {
  appInfo?: AppInfo;
}

const Header = ({ appInfo }: HeaderProps) => {
  const defaultTitle = "مجوهرات أبو رميلة";
  const defaultSubtitle = "أفضل أنواع الذهب والمجوهرات الفاخرة";

  return (
    <header className="bg-white/50 backdrop-blur-sm py-6 shadow-md">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Crown className="h-8 w-8 text-amber-600" />
          <h1 className="text-3xl font-bold text-amber-800">
            {appInfo?.title || defaultTitle}
          </h1>
          <Crown className="h-8 w-8 text-amber-600" />
        </div>
        
        <p className="text-lg text-amber-700 font-medium mb-4">
          {appInfo?.description || defaultSubtitle}
        </p>
        
        <div className="flex items-center justify-center gap-6 text-amber-600">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-current" />
            <span className="text-sm font-medium">جودة عالية</span>
          </div>
          <div className="flex items-center gap-2">
            <Gem className="h-5 w-5" />
            <span className="text-sm font-medium">تشكيلة متنوعة</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            <span className="text-sm font-medium">خبرة عريقة</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
