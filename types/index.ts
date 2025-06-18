export type locationType = {
  type: string;
  coordinates: [number, number];
};
export enum EventTypeEnum {
  MeteorShower = "Meteor Shower",
  ISSPass = "ISS Pass",
  LunarEclipse = "Lunar Eclipse",
}

export interface UserInterface {
  name: string;
  email: string;
  password: string;
  location: locationType;
  bio: string;
  savedEvents: string[];
}

export interface userPostInterface{
  _id:string
  bio:string
  email:string
  name:string
}

export interface PostInterface {
  imageUrl: string;
  caption: string;
  location: locationType;
  visibilityScore: number;
}

export interface PostResponseInterface extends PostInterface {
  eventId: any;
  likes: [String];
  dislikes: [String];
  likesCount: number;
  dislikesCount: number;
  _id: string;
  createdAt: Date;
  userId:userPostInterface
}

export interface EventInterface {
  name: string;
  description: string;
  type: EventTypeEnum;
  visibilityScore: number;
  startTime: Date;
  endTime: Date;
  visibilityRegions: [String];
  moonPhase: number;
  source: string;
}

export interface EventResponseInterface extends EventInterface {
  postedUserIds: [String];
  interestedUserIds: [String];
  _id: string;
  createdAt: Date;
}

export interface AuthStore {
  user: UserInterface | null;
  token: string | null;
  loading: boolean;
  setToken: (token: string) => void;
  getUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
