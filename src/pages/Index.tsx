import { useFitnessChat } from '@/hooks/useFitnessChat';
import { FitnessProfileForm } from '@/components/FitnessProfileForm';
import { FitnessChat } from '@/components/FitnessChat';

const Index = () => {
  const {
    userProfile,
    chatState,
    chatStarted,
    updateProfile,
    startChat,
    sendMessage,
    resetChat
  } = useFitnessChat();

  if (chatStarted) {
    return (
      <FitnessChat
        userProfile={userProfile}
        chatState={chatState}
        onSendMessage={sendMessage}
        onBackToProfile={resetChat}
      />
    );
  }

  return (
    <FitnessProfileForm
      userProfile={userProfile}
      onUpdateProfile={updateProfile}
      onStartChat={startChat}
    />
  );
};

export default Index;
