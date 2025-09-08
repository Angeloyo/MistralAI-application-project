"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Trash2, Settings } from "lucide-react";
import { toast } from "sonner";
import { useApiKey } from "@/hooks/useApiKey";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { apiKey, saveApiKey, clearApiKey, hasApiKey } = useApiKey();

  useEffect(() => {
    if (isOpen) {
      setInputValue(apiKey);
    }
  }, [isOpen, apiKey]);

  const handleSave = () => {
    const success = saveApiKey(inputValue);
    if (success) {
      toast.success("API key saved successfully!");
      setIsOpen(false);
    } else {
      toast.error("Failed to save API key. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              Mistral API Key
            </label>
            <div className="flex space-x-2 mt-2">
              <div className="relative flex-1">
                <Input
                  id="api-key"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Mistral API key"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  if (inputValue.trim() || apiKey) {
                    setInputValue("");
                    const success = clearApiKey();
                    if (success) {
                      toast.success("API key cleared");
                    } else {
                      toast.error("Failed to clear API key");
                    }
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Your API key will be stored locally in your browser
            </p>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}