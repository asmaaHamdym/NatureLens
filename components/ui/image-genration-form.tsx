"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { analyzeImage } from "@/server/images";
import { Loader2 } from "lucide-react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";

const formSchema = z.object({
  prompt: z.string().optional(),
});

export default function ImageGenerationForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const [files, setFiles] = useState<File[]>([]);
  const handleDrop = (droppedFiles: File[]) => {
    console.log(droppedFiles);
    setFiles(droppedFiles);
  };

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await analyzeImage(files);
      console.log("Analysis response:", response);
      setImageUrl(response.cute_avatar_img_url);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type a prompt or upload file</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type yor prompt here...."
                      {...field}
                    />
                  </FormControl>
                  <Dropzone
                    className=""
                    accept={{ "image/*": [] }}
                    maxFiles={10}
                    maxSize={1024 * 1024 * 10}
                    minSize={1024}
                    onDrop={handleDrop}
                    onError={console.error}
                    src={files}
                  >
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </Dropzone>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit" className="ml-4">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {imageUrl && (
        <div className="mt-8">
          <Image
            src={imageUrl}
            alt="Generated Image"
            className="max-w-full h-auto"
            width={1000}
            height={1000}
          />
        </div>
      )}
    </>
  );
}
