interface DetailItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
  }
  
  const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm text-muted-foreground">{value}</span>
      </div>
    );
  };
  
  export default DetailItem;