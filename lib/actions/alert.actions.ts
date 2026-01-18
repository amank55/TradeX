'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Alert } from '@/database/models/alert.model';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth } from '../better-auth/auth';

export async function createAlert(
  symbol: string,
  company: string,
  alertName: string,
  alertType: string,
  condition: string,
  thresholdValue: number,
  frequency: string
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    // Validate inputs
    if (!alertName?.trim()) {
      return { success: false, error: 'Alert name is required' };
    }

    if (!symbol?.trim()) {
      return { success: false, error: 'Symbol is required' };
    }

    if (!thresholdValue || thresholdValue <= 0) {
      return { success: false, error: 'Threshold value must be greater than 0' };
    }

    // Check if alert already exists with same criteria
    const existingAlert = await Alert.findOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      condition,
      thresholdValue,
    });

    if (existingAlert) {
      return { success: false, error: 'This alert already exists' };
    }

    // Create new alert
    const newAlert = new Alert({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      company: company?.trim() || symbol.toUpperCase(),
      alertName: alertName.trim(),
      alertType: alertType || 'price',
      condition: condition || 'greater-than',
      thresholdValue: Number(thresholdValue),
      frequency: frequency || 'once',
      isActive: true,
    });

    await newAlert.save();
    revalidatePath('/watchlist');

    return { 
      success: true, 
      message: 'Price alert created successfully',
      alertId: newAlert._id 
    };
  } catch (error) {
    console.error('Error creating alert:', error);
    return { success: false, error: 'Failed to create alert' };
  }
}

export async function getAlerts() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    const alerts = await Alert.find({ userId: session.user.id }).lean();
    return JSON.parse(JSON.stringify(alerts));
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

export async function deleteAlert(alertId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    await Alert.deleteOne({
      _id: alertId,
      userId: session.user.id,
    });
    revalidatePath('/watchlist');

    return { success: true, message: 'Alert deleted successfully' };
  } catch (error) {
    console.error('Error deleting alert:', error);
    return { success: false, error: 'Failed to delete alert' };
  }
}

export async function toggleAlert(alertId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    const alert = await Alert.findOneAndUpdate(
      {
        _id: alertId,
        userId: session.user.id,
      },
      [{ $set: { isActive: { $not: '$isActive' } } }],
      { new: true }
    );

    if (!alert) {
      return { success: false, error: 'Alert not found' };
    }

    revalidatePath('/watchlist');
    return { 
      success: true, 
      message: 'Alert updated successfully',
      isActive: alert.isActive 
    };
  } catch (error) {
    console.error('Error toggling alert:', error);
    return { success: false, error: 'Failed to toggle alert' };
  }
}
