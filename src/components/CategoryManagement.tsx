
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface CategoryManagementProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
}

const CategoryManagement = ({ categories, onUpdateCategories }: CategoryManagementProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#d97706"
  });
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم التصنيف",
        variant: "destructive",
      });
      return;
    }

    const category: Category = {
      ...newCategory,
      id: Date.now().toString(),
    };

    onUpdateCategories([...categories, category]);
    setNewCategory({ name: "", description: "", color: "#d97706" });
    setShowAddForm(false);
    
    toast({
      title: "تم إضافة التصنيف",
      description: "تم إضافة التصنيف الجديد بنجاح",
    });
  };

  const handleDeleteCategory = (id: string) => {
    onUpdateCategories(categories.filter(cat => cat.id !== id));
    toast({
      title: "تم حذف التصنيف",
      description: "تم حذف التصنيف بنجاح",
    });
  };

  const handleEditCategory = (category: Category) => {
    onUpdateCategories(categories.map(cat => cat.id === category.id ? category : cat));
    setEditingCategory(null);
    toast({
      title: "تم تحديث التصنيف",
      description: "تم تحديث التصنيف بنجاح",
    });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
      <CardHeader>
        <CardTitle className="text-lg text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            إدارة التصنيفات
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="p-4 border border-amber-200 rounded-lg space-y-3">
            <div>
              <Label>اسم التصنيف</Label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="مثال: خواتم"
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
            <div>
              <Label>الوصف</Label>
              <Input
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="وصف التصنيف"
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
            <div>
              <Label>اللون</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-12 h-10 rounded border border-amber-300"
                />
                <Input
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="flex-1 border-amber-300 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCategory} className="bg-amber-600 hover:bg-amber-700">
                إضافة
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-3 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <span className="font-medium text-amber-800">{category.name}</span>
                  {category.description && (
                    <p className="text-xs text-gray-600">{category.description}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingCategory(category)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {categories.length === 0 && !showAddForm && (
          <div className="text-center py-4">
            <p className="text-gray-500">لا توجد تصنيفات بعد</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;
