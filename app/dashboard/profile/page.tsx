"use client";

import React, { useState, useEffect } from "react";
import * as z from "zod";
import DefaultAvatar from "@/public/images/placeholderProfile.png";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Trash } from "lucide-react";
import { useGetProfileQuery, useUpdateProfileImageMutation, useRemoveProfileImageMutation, useUpdateProfileMutation } from "@/services/profileApi";
import { CldUploadWidget } from "next-cloudinary";
import { useToast } from "@/hooks/use-toast";
import { setUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import Loader from "@/components/ui/loader";


// Update schema: confirmPassword required if password is present, and must match
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password || data.newPassword || data.confirmPassword) {
    return data.password && data.newPassword && data.confirmPassword && data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "New password and confirm password must match.",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState(DefaultAvatar.src);
  const [updateProfileImage, { isLoading: isImageUploading }] = useUpdateProfileImageMutation();
  const [removeProfileImage, { isLoading: isRemoving }] = useRemoveProfileImageMutation();
  const [updateProfile, { isLoading: isProfileUpdating }] = useUpdateProfileMutation();

  const dispatch = useDispatch();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Your Name",
      email: "your.email@example.com",
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { data, isLoading: isProfileLoading,isFetching:isProfileFetching } = useGetProfileQuery();

  useEffect(() => {
    if (data) {
      profileForm.reset({ name: data.name, email: data.email, password: "", newPassword: "", confirmPassword: "" });
      setAvatarUrl(data.image || DefaultAvatar.src);
    }
  }, [data]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      const payload: any = { name: data.name };
      if (data.password && data.newPassword && data.confirmPassword) {
        payload.password = data.password;
        payload.newPassword = data.newPassword;
      }
      const response = await updateProfile(payload).unwrap();
      toast({
        title: response.message,
      });
      profileForm.reset({
        ...profileForm.getValues(),
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        title: error?.data?.error || error?.message || "Failed to update profile.",
      });
    }
  }

  function handleRemoveAvatar() {
    removeProfileImage()
      .unwrap()
      .then(() => {
        setAvatarUrl(DefaultAvatar.src);
        dispatch(setUser({
          ...data,
          image: undefined
        }));
        toast({ title: "Profile image removed" });
      })
      .catch(() => {
        toast({ title: "Failed to remove profile image" });
      });
  }

  if (isProfileLoading || isProfileFetching || isProfileUpdating) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="relative w-28 h-28">
            <Avatar className="w-28 h-28 border-2 border-gray-300 bg-white overflow-hidden">
              <AvatarImage
                src={avatarUrl}
                alt="Profile Avatar"
                className={`object-cover w-full h-full rounded-full ${isImageUploading || isRemoving ? "opacity-60" : ""}`}
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            {(isImageUploading || isRemoving) && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                data-testid="loader-container"
              >
                <Loader /> 
              </div>
            )}
          </div>
          {avatarUrl === DefaultAvatar.src ? (
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{ maxFiles: 1, resourceType: "image" }}
              onSuccess={async (result: any) => {
                if (result.info && result.info.secure_url) {
                  setAvatarUrl(result.info.secure_url);
                  await updateProfileImage({ image: result.info.secure_url });
                  dispatch(setUser({
                    ...data,
                    image: result.info.secure_url
                  }));
                  document.body.style.overflow = "";
                  toast({ title: "Profile image updated successfully" });
                }
              }}
            >
              {({ open }) => (
                <span
                  className="absolute bottom-2 right-2 cursor-pointer"
                  title="Upload photo"
                  onClick={() => open()}
                >
                  <span className="flex justify-center items-center w-10 h-9 rounded-full bg-white shadow-md border-2 border-gray-200 hover:bg-gray-100">
                    <Pencil className="w-5 h-5 text-gray-700" />
                  </span>
                </span>
              )}
            </CldUploadWidget>
          ) : (
            <span
              className="absolute bottom-2 right-2 cursor-pointer"
              title="Remove photo"
              onClick={handleRemoveAvatar}
            >
              <span className="flex justify-center items-center w-9 h-9 rounded-full bg-white shadow-md border-2 border-gray-200 hover:bg-gray-100">
                <Trash className="w-5 h-5 text-red-600" />
              </span>
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold mt-2 text-center">My Profile</h2>
      </div>
      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={profileForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Current Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="New Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isProfileUpdating || isProfileLoading || isProfileFetching}>
            {isProfileUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}