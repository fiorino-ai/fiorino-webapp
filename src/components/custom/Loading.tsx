import { Webhook } from "lucide-react";

const Loading: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center z-[9999]">
      <Webhook className="loading-icon" />
    </div>
  );
};

export default Loading;
