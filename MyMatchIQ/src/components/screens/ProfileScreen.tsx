import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, User, Edit2, Save, X, Heart, Target, Calendar, MapPin, Mail, Phone, Check, Crown, Sparkles, Zap, Globe, Camera, Image as ImageIcon } from 'lucide-react';
import { UserProfile, SubscriptionTier } from '../../App';
import { LanguageSelector } from '../LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../utils/supabaseClient';

interface ProfileScreenProps {
  profile: UserProfile | null;
  subscriptionTier: SubscriptionTier;
  onBack: () => void;
  onSave: (profile: UserProfile) => void;
  onManageSubscription: () => void;
  onResetAllData: () => void;
  onNavigate?: (screen: 'blueprintHome') => void;
}

export function ProfileScreen({ profile, subscriptionTier, onBack, onSave, onManageSubscription, onResetAllData, onNavigate }: ProfileScreenProps) {
  const { t, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(
    profile || { name: '', age: 25, datingGoal: 'serious', location: '', email: '', phone: '', bio: '' }
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  // Load profile image on mount
  useEffect(() => {
    // Try to load from localStorage first for immediate display
    const cachedImage = localStorage.getItem(`profile_image_${profile?.email}`);
    if (cachedImage) {
      setProfileImage(cachedImage);
    }
    
    // Then check if there's a URL from profile data
    if (profile?.email) {
      const storedUrl = localStorage.getItem(`profile_image_url_${profile.email}`);
      if (storedUrl) {
        setProfileImage(storedUrl);
      }
    }
  }, [profile?.email]);
  
  // Update profile language when language changes in LanguageSelector
  useEffect(() => {
    if (profile && profile.language !== language) {
      const updatedProfile = { ...profile, language };
      onSave(updatedProfile);
    }
  }, [language]);

  const DATING_GOALS = [
    { id: 'casual', label: t('goal.casual'), icon: '☕', description: t('goal.casualDesc') },
    { id: 'serious', label: t('goal.serious'), icon: '💑', description: t('goal.seriousDesc') },
    { id: 'long-term', label: t('goal.longTerm'), icon: '💕', description: t('goal.longTermDesc') },
    { id: 'marriage', label: t('goal.marriage'), icon: '💍', description: t('goal.marriageDesc') },
  ] as const;

  const handleSave = () => {
    onSave(editedProfile);
    setIsEditing(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleCancel = () => {
    setEditedProfile(profile || { name: '', age: 25, datingGoal: 'serious', location: '', email: '', phone: '', bio: '' });
    setIsEditing(false);
  };

  const handleResetData = () => {
    onResetAllData();
    setShowResetModal(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.email) {
      console.error('No file or profile email');
      return;
    }

    try {
      setIsUploadingImage(true);
      setShowImageUploadModal(false);

      // First, read file as data URL for immediate display
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setProfileImage(dataUrl);
        // Cache in localStorage for persistence
        localStorage.setItem(`profile_image_${profile.email}`, dataUrl);
      };
      reader.readAsDataURL(file);

      // Then upload to Supabase Storage
      // Create a safe filename based on email and timestamp
      const fileExt = file.name.split('.').pop() || 'jpg';
      const safeEmail = profile.email.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${safeEmail}/avatar_${Date.now()}.${fileExt}`;

      console.log('Uploading to Supabase:', fileName);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Supabase upload error:', error);
        // Still keep the local version
        setIsUploadingImage(false);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      console.log('Image uploaded successfully:', publicUrl);

      // Store the URL in localStorage
      localStorage.setItem(`profile_image_url_${profile.email}`, publicUrl);
      setProfileImage(publicUrl);

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Your image is saved locally.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
    setShowImageUploadModal(false);
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
    setShowImageUploadModal(false);
  };

  const currentGoal = DATING_GOALS.find(g => g.id === editedProfile.datingGoal);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 px-6 pt-12 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={onBack}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">{t('profile.editProfile')}</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm">{t('common.cancel')}</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-rose-600 rounded-xl hover:bg-white/90 transition-all shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span className="text-sm">{t('common.save')}</span>
                </button>
              </div>
            )}
          </div>

          <div className="text-center">
            <h1 className="text-3xl text-white mb-2">{t('profile.title')}</h1>
            <p className="text-white/80">{t('profile.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>{t('profile.savedSuccess')}</span>
          </div>
        </div>
      )}

      <div className="px-6 -mt-24 relative z-10 space-y-6">
        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white overflow-hidden">
              {isUploadingImage ? (
                <div className="w-full h-full flex items-center justify-center bg-rose-400/80">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>
            {isEditing && (
              <button 
                onClick={() => setShowImageUploadModal(true)}
                disabled={isUploadingImage}
                className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-rose-200 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit2 className="w-4 h-4 text-rose-600" />
              </button>
            )}
          </div>
        </div>
        
        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Basic Information */}
        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl text-gray-900 mb-4">{t('profile.basicInfo')}</h2>
          
          {/* Name */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">{t('profile.fullName')}</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:border-rose-400 focus:outline-none transition-all"
                placeholder="Enter your name"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{editedProfile.name || 'Not set'}</span>
              </div>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">{t('profile.age')}</label>
            {isEditing ? (
              <input
                type="number"
                value={editedProfile.age}
                onChange={(e) => setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:border-rose-400 focus:outline-none transition-all"
                placeholder="Enter your age"
                min="18"
                max="99"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{editedProfile.age} {t('profile.yearsOld')}</span>
              </div>
            )}
          </div>
        </div>

        {/* About You Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl text-gray-900 mb-4">{t('profile.aboutYou')}</h2>
          
          {/* Location */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">{t('profile.location')}</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.location || ''}
                onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:border-rose-400 focus:outline-none transition-all"
                placeholder="City, State"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{editedProfile.location || 'Not set'}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">{t('profile.email')}</label>
            {isEditing ? (
              <input
                type="email"
                value={editedProfile.email || ''}
                onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:border-rose-400 focus:outline-none transition-all"
                placeholder="your@email.com"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{editedProfile.email || 'Not set'}</span>
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">{t('profile.phone')}</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedProfile.phone || ''}
                onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:border-rose-400 focus:outline-none transition-all"
                placeholder="(555) 123-4567"
              />
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{editedProfile.phone || 'Not set'}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">{t('profile.bio')}</label>
            {isEditing ? (
              <textarea
                value={editedProfile.bio || ''}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:border-rose-400 focus:outline-none transition-all resize-none"
                placeholder={t('profile.bioPlaceholder')}
                rows={4}
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-2xl min-h-[100px]">
                <p className="text-gray-900">{editedProfile.bio || 'Not set'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dating Goal */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-xl text-gray-900">{t('profile.datingGoal')}</h2>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              {DATING_GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setEditedProfile({ ...editedProfile, datingGoal: goal.id })}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    editedProfile.datingGoal === goal.id
                      ? 'border-rose-400 bg-gradient-to-br from-rose-50 to-pink-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="text-gray-900">{goal.label}</span>
                    {editedProfile.datingGoal === goal.id && (
                      <Check className="w-5 h-5 text-rose-600 ml-auto" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 ml-11">{goal.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border-2 border-rose-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{currentGoal?.icon}</span>
                <span className="text-lg text-gray-900">{currentGoal?.label}</span>
              </div>
              <p className="text-sm text-gray-600 ml-14">{currentGoal?.description}</p>
            </div>
          )}
        </div>

        {/* Account Stats */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl shadow-lg p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl text-gray-900">{t('profile.accountActivity')}</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/60 rounded-2xl">
              <div className="text-2xl text-purple-900 mb-1">12</div>
              <div className="text-xs text-purple-700">{t('profile.daysActive')}</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-2xl">
              <div className="text-2xl text-purple-900 mb-1">5</div>
              <div className="text-xs text-purple-700">{t('profile.scans')}</div>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-2xl">
              <div className="text-2xl text-purple-900 mb-1">87%</div>
              <div className="text-xs text-purple-700">{t('profile.accuracy')}</div>
            </div>
          </div>
        </div>

        {/* My Match Blueprint */}
        {onNavigate && (
          <button 
            onClick={() => onNavigate('blueprintHome')}
            className="w-full bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 p-6 rounded-3xl hover:shadow-lg transition-all relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 px-2 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full text-xs text-white">
              NEW
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-left flex-1">
                <h3 className="text-gray-900 mb-1">My Match Blueprint™</h3>
                <p className="text-sm text-gray-600">Build your ideal match profile.</p>
              </div>
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 text-rose-600" />
              </div>
            </div>
          </button>
        )}

        {/* Preferences Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-xl text-gray-900 mb-4">{t('profile.preferences')}</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-900">{t('profile.emailNotifications')}</div>
                  <div className="text-xs text-gray-500">{t('profile.emailNotificationsDesc')}</div>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-rose-500 transition-all"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-gray-900">{t('profile.pushNotifications')}</div>
                  <div className="text-xs text-gray-500">{t('profile.pushNotificationsDesc')}</div>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-rose-500 transition-all"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-gray-900">{t('profile.locationServices')}</div>
                  <div className="text-xs text-gray-500">{t('profile.locationServicesDesc')}</div>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-rose-500 transition-all"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
              </label>
            </div>

            {/* Language Selector */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-gray-900">{t('profile.language')}</div>
                  <div className="text-xs text-gray-500">{t('profile.languageDesc')}</div>
                </div>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        {!isEditing && (
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl shadow-lg p-6 border border-red-200">
            <h2 className="text-xl text-gray-900 mb-4">{t('profile.accountActions')}</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowResetModal(true)}
                className="w-full p-4 bg-white rounded-2xl border border-gray-200 hover:border-red-300 transition-all text-left"
              >
                <div className="text-gray-900 mb-1">{t('profile.resetData')}</div>
                <div className="text-xs text-gray-500">{t('profile.resetDataDesc')}</div>
              </button>
              
              <button className="w-full p-4 bg-white rounded-2xl border border-red-200 hover:bg-red-50 transition-all text-left">
                <div className="text-red-600 mb-1">{t('profile.deleteAccount')}</div>
                <div className="text-xs text-red-500">{t('profile.deleteAccountDesc')}</div>
              </button>
            </div>
          </div>
        )}

        {/* Subscription Section */}
        {!isEditing && (
          <div className={`rounded-3xl shadow-lg p-6 border-2 ${
            subscriptionTier === 'free'
              ? 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200'
              : subscriptionTier === 'premium'
              ? 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200'
              : 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gray-900">{t('profile.subscription')}</h2>
              <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                subscriptionTier === 'free'
                  ? 'bg-gray-200 text-gray-700'
                  : subscriptionTier === 'premium'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
              }`}>
                {subscriptionTier === 'free' ? (
                  <Sparkles className="w-3 h-3" />
                ) : subscriptionTier === 'premium' ? (
                  <Crown className="w-3 h-3" />
                ) : (
                  <Zap className="w-3 h-3" />
                )}
                <span>{t(`sub.${subscriptionTier}`)}</span>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border-2 mb-4 ${
              subscriptionTier === 'free'
                ? 'bg-white border-gray-200'
                : subscriptionTier === 'premium'
                ? 'bg-white/60 border-rose-300'
                : 'bg-white/60 border-purple-300'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {subscriptionTier === 'free' ? (
                  <>
                    <Sparkles className="w-6 h-6 text-gray-500" />
                    <span className="text-lg text-gray-900">{t('profile.freePlan')}</span>
                  </>
                ) : subscriptionTier === 'premium' ? (
                  <>
                    <Crown className="w-6 h-6 text-rose-600" />
                    <span className="text-lg text-gray-900">{t('profile.premiumPlan')}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 text-purple-600" />
                    <span className="text-lg text-gray-900">{t('profile.exclusivePlan')}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 ml-9">
                {subscriptionTier === 'free' 
                  ? '1 scan/week • Basic score • 3 categories'
                  : subscriptionTier === 'premium'
                  ? 'Unlimited scans • Dual mode • Full breakdown'
                  : 'Everything + AI Coach • Live assistance'
                }
              </p>
            </div>

            <button
              onClick={onManageSubscription}
              className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl hover:shadow-lg transition-all"
            >
              {subscriptionTier === 'free' ? t('profile.upgradePlan') : t('profile.manageSubscription')}
            </button>
          </div>
        )}
      </div>

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-[slideUp_0.3s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h2 className="text-2xl text-gray-900 mb-2">Reset All Data?</h2>
              <p className="text-gray-600 leading-relaxed">
                This will permanently delete all your match scans and assessment data. This action <strong>cannot</strong> be undone.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <p className="text-sm text-red-800 text-center">
                ⚠️ Your profile information and subscription will not be affected
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:shadow-lg transition-all"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-6 z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md animate-[slideUp_0.3s_ease-out]">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl text-gray-900">Change Profile Picture</h2>
                <button
                  onClick={() => setShowImageUploadModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-3">
              {/* Camera Option */}
              <button
                onClick={handleCameraClick}
                className="w-full p-5 bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-2xl hover:shadow-lg transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-gray-900 font-medium mb-1">Take Photo</div>
                  <div className="text-sm text-gray-600">Use your camera</div>
                </div>
              </button>

              {/* Gallery Option */}
              <button
                onClick={handleGalleryClick}
                className="w-full p-5 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl hover:shadow-lg transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-gray-900 font-medium mb-1">Choose from Gallery</div>
                  <div className="text-sm text-gray-600">Select from your photos</div>
                </div>
              </button>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => setShowImageUploadModal(false)}
                className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}