import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    let student = await User.findOne({ role: 'student' });
    
    if (!student) {
      student = await User.create({
        name: 'Student',
        role: 'student',
        coins: 0,
        coupons: 0
      });
    }
    
    return NextResponse.json(student);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const student = await User.findOneAndUpdate(
      { role: 'student' },
      { $set: data },
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    
    return NextResponse.json(student);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
