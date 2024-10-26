import mongoose, {Schema, Document} from 'mongoose';

// Interface for User 

 export interface Message extends Document {
    content: string;
    createdAt: Date;
} 

const MessageSchema: Schema<Message> = new Schema({
    content: {type: String, required: true},
    createdAt: {type: Date, required: true,default: Date.now}
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    isVerified: boolean;
    messages: Message[];
} 

const UserSchema: Schema<User> = new Schema({
    username: {type: String, required: [true, 'Username is required'], trim: true, unique: true},
    email: {type: String, required: [true, 'Email is required'], trim: true, unique: true, match: [/\S+@\S+\.\S+/, 'Please enter a valid email']},
    password: {type: String, required: [true, 'Password is required']},
    verifyCode: {type: String, required: [true, 'Verify code is required']},
    verifyCodeExpiry: {type: Date, required: [true, 'Verify code expiry is required']},
    isAcceptingMessage: {type: Boolean, required: [true, 'Is accepting message is required'], default: true},
    isVerified: {type: Boolean, default: false},
    messages: [MessageSchema]
});

// Export the model and return your User interface  
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User', UserSchema));
export default UserModel;