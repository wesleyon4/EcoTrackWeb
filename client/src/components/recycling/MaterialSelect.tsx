
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface MaterialSelectProps {
  materials: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
}

const MaterialSelect: React.FC<MaterialSelectProps> = ({
  materials,
  value,
  onChange,
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Filter by material" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Materials</SelectItem>
        {materials.map((material) => (
          <SelectItem key={material.id} value={material.id || "unknown"}>
            {material.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MaterialSelect;
