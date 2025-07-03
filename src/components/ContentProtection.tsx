
import { useEffect } from "react";

const ContentProtection = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // منع النقر بالزر الأيمن
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // منع اختصارات لوحة المفاتيح للنسخ والطباعة وتصوير الشاشة
    const handleKeyDown = (e: KeyboardEvent) => {
      // منع Ctrl+C, Ctrl+A, Ctrl+S, Ctrl+P, F12, Print Screen
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 's' || e.key === 'p')) ||
        e.key === 'F12' ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        return false;
      }
    };

    // منع السحب والإفلات للصور
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // منع تحديد النص
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // إضافة مستمعات الأحداث
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);

    // تطبيق CSS لمنع التحديد
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      
      img {
        -webkit-user-drag: none;
        -moz-user-drag: none;
        -ms-user-drag: none;
        user-drag: none;
        pointer-events: none;
      }
      
      input, textarea {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
    `;
    document.head.appendChild(style);

    // تنظيف عند إلغاء التحميل
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.head.removeChild(style);
    };
  }, []);

  return <div className="content-protected">{children}</div>;
};

export default ContentProtection;
