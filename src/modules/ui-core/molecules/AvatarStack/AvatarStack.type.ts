export interface StackPerson {
  id: string;
  name: string;
  color: string;
  avatar?: string | null;
}

export interface AvatarStackProps {
  people: StackPerson[];
  max?: number;
  size?: number;
}
