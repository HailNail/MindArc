import { Box } from "@radix-ui/themes";

interface MessageProps {
  variant: "success" | "error" | "info";
  children: React.ReactNode;
}

const Message = ({ variant, children }: MessageProps) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-[var(--green-4)] text-[var(--green-10)]";
      case "error":
        return "bg-[var(--ruby-4)] text-[var(--ruby-10)]";
      case "info":
        return "bg-[var(--teal-4)] text-[var(--teal-10)]";
      default:
        return "bg-[var(--gray-4)] text-[var(--gray-10)]";
    }
  };
  return (
    <Box p="4" className={`rounded-md ${getVariantClass()}`}>
      {children}
    </Box>
  );
};

export default Message;
