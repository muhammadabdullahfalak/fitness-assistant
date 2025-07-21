import { useState } from 'react';
import { UserProfile } from '@/constants/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Scale, Calendar, Sparkles } from 'lucide-react';
import { images } from '@/constants/images';

interface FitnessProfileFormProps {
  userProfile: UserProfile;
  onUpdateProfile: (field: keyof UserProfile, value: string) => void;
  onStartChat: () => void;
}

export const FitnessProfileForm = ({ userProfile, onUpdateProfile, onStartChat }: FitnessProfileFormProps) => {
  const [errors, setErrors] = useState<Partial<UserProfile>>({});

  const validateForm = () => {
    const newErrors: Partial<UserProfile> = {};
    
    if (!userProfile.age || parseInt(userProfile.age) < 13 || parseInt(userProfile.age) > 120) {
      newErrors.age = 'Please enter a valid age between 13-120';
    }
    
    if (!userProfile.weight || parseFloat(userProfile.weight) < 30 || parseFloat(userProfile.weight) > 300) {
      newErrors.weight = 'Please enter a valid weight between 30-300kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartChat = () => {
    if (validateForm()) {
      onStartChat();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          <img 
            src={images.hero} 
            alt="Fitness Hero" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="p-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-slide-up">
                AI Fitness
                <span className="bg-fitness-gradient bg-clip-text text-transparent"> Assistant</span>
              </h1>
              <p className="text-xl text-gray-200 animate-slide-up">
                Your personalized fitness journey starts here
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <Card className="border-0 shadow-fitness-glow animate-bounce-in">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-fitness-gradient flex items-center justify-center mb-4 animate-pulse-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Tell Us About Yourself</CardTitle>
            <CardDescription className="text-lg">
              Help us create the perfect fitness plan just for you
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Age Input */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-fitness-primary" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={userProfile.age}
                  onChange={(e) => onUpdateProfile('age', e.target.value)}
                  className="h-12 text-lg border-2 focus:border-fitness-primary transition-colors"
                />
                {errors.age && <p className="text-destructive text-sm">{errors.age}</p>}
              </div>

              {/* Sex Select */}
              <div className="space-y-2">
                <Label htmlFor="sex" className="text-base font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-fitness-primary" />
                  Sex
                </Label>
                <Select value={userProfile.sex} onValueChange={(value) => onUpdateProfile('sex', value)}>
                  <SelectTrigger className="h-12 text-lg border-2 focus:border-fitness-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Weight Input */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-base font-semibold flex items-center gap-2">
                  <Scale className="w-4 h-4 text-fitness-primary" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={userProfile.weight}
                  onChange={(e) => onUpdateProfile('weight', e.target.value)}
                  className="h-12 text-lg border-2 focus:border-fitness-primary transition-colors"
                />
                {errors.weight && <p className="text-destructive text-sm">{errors.weight}</p>}
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleStartChat}
                disabled={!userProfile.age || !userProfile.weight}
                size="lg"
                className="bg-fitness-gradient hover:bg-fitness-gradient-dark h-14 px-12 text-lg font-semibold shadow-fitness-glow hover:shadow-none transition-all duration-300 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Fitness Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};