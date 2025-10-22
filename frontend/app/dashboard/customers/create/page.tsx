'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, ArrowLeft } from 'lucide-react';

// ✅ Validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Must be a valid email'),
  phoneNumber: z
    .string()
    .min(10, 'Invalid phone number')
    .regex(/^\+?[0-9]{10,15}$/, 'Phone must include country code'),
  vatTinNo: z.string().min(1, 'VAT/TIN number is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CustomerCreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Get username from Redux store at the top level
  const username = typeof window !== "undefined" && window.localStorage ? window.localStorage.getItem("username") : null;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      vatTinNo: '',
      address: '',
      city: '',
      country: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      
      const accessToken = typeof window !== "undefined" && window.localStorage ? window.localStorage.getItem("username") : null;

      if (!accessToken) {
        toast.error('No access token found. Please log in again.');
        setLoading(false);
        return;
      }

      let url = process.env.NEXT_PUBLIC_BACKEND_URI;
      if (process.env.NODE_ENV === "production") {
        url = process.env.NEXT_PUBLIC_EXPRESS_URI;
      }

      const res = await fetch(`${url}/api/v1/customer/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create customer');
      }

      toast.success('Customer created successfully!');
    } catch (err) {
      toast.error((err as Error).message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-lg border border-gray-200 shadow-md">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Save className="w-6 h-6 text-primary" /> Create Customer
          </CardTitle>
          <Separator className="my-2 w-full" />
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name *</Label>
              <Input id="name" placeholder="John Smith" {...form.register('name')} />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="email@example.com" {...form.register('email')} />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Mobile Phone *</Label>
              <Input id="phoneNumber" placeholder="+254710123456" {...form.register('phoneNumber')} />
              {form.formState.errors.phoneNumber && (
                <p className="text-red-500 text-sm">{form.formState.errors.phoneNumber.message}</p>
              )}
            </div>

            {/* VAT/TIN */}
            <div className="space-y-2">
              <Label htmlFor="vatTinNo">VAT / TIN No *</Label>
              <Input id="vatTinNo" placeholder="e.g. 123456789" {...form.register('vatTinNo')} />
              {form.formState.errors.vatTinNo && (
                <p className="text-red-500 text-sm">{form.formState.errors.vatTinNo.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="101 James Doolittle Blvd" {...form.register('address')} />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="e.g. Nairobi" {...form.register('city')} />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="e.g. Kenya" {...form.register('country')} />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </Button>

            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Create Customer
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
