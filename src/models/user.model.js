import mongoose from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username field cannot be empty"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email required"],
        unique:true,
        trim:true,
        lowercase:true
    },
    password: {
        type:String,
        required:true,
    },
    verified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10); 
    next();
})


userSchema.methods.comparePassword = function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model("User",userSchema);

export default User;