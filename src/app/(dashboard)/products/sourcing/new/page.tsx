/**
 * New Sourcing Request Page
 * @description Create a new sourcing request
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, ImagePlus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

/**
 * New sourcing request form data
 */
interface SourcingFormData {
  productName: string;
  description: string;
  images: string[];
  targetPrice?: number;
  quantity?: number;
}

/**
 * New Sourcing Request Page
 */
export default function NewSourcingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SourcingFormData>({
    productName: '',
    description: '',
    images: [],
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle image upload (simulated)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Simulate image upload
    const currentImages = [...formData.images];
    const maxImages = 5;

    for (let i = 0; i < files.length && currentImages.length < maxImages; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        if (currentImages.length < maxImages) {
          currentImages.push(reader.result as string);
          setFormData((prev) => ({
            ...prev,
            images: [...currentImages],
          }));
        }
      };
      reader.readAsDataURL(file);
    }

    // Clear image error
    if (errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Partial<Record<string, string>> = {};
    if (!formData.productName.trim()) {
      newErrors.productName = 'Please enter the product name';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter the product description';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'Please upload at least one product image';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      // TODO: Call API to submit sourcing request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Sourcing request submitted successfully');
      router.push('/products/sourcing');
    } catch (err) {
      console.error('Failed to submit sourcing request:', err);
      setErrors({ submit: 'Submission failed, please try again' });
      toast.error('Submission failed, please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader
        title="New Sourcing Request"
        breadcrumb={[
          { label: 'Source Products', href: '/products/all' },
          { label: 'Sourcing Requests', href: '/products/sourcing' },
          { label: 'New' },
        ]}
        actions={
          <Button
            variant="ghost"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="w-5 h-4" />}
          >
            Back
          </Button>
        }
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Product name */}
          <Input
            label="Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            placeholder="Enter the name of the product you want to source"
            error={errors.productName}
            required
          />

          {/* Product description */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Please describe the product specifications, quantity, quality requirements, etc."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Image upload */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Product Images <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <div className="flex items-start gap-4">
                {/* Upload button */}
                <label className="cursor-pointer flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-gray-50 transition-colors">
                  <ImagePlus className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Click to upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={formData.images.length >= 5}
                  />
                </label>

                {/* Uploaded image previews */}
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative w-24 h-24">
                        <img
                          src={image}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.images && (
                <p className="text-sm text-red-500 mt-1">{errors.images}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Upload up to 5 images, currently uploaded {formData.images.length}/5
              </p>
            </div>
          </div>

          {/* Target price and quantity */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Target Price"
              name="targetPrice"
              value={formData.targetPrice ?? ''}
              onChange={handleInputChange}
              placeholder="Enter target price"
              min={0}
              hint="Your expected unit price"
            />
            <Input
              type="number"
              label="Required Quantity"
              name="quantity"
              value={formData.quantity ?? ''}
              onChange={handleInputChange}
              placeholder="Enter required quantity"
              min={1}
              hint="The quantity you need"
            />
          </div>

          {/* Submit error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {errors.submit}
            </div>
          )}
        </div>

        {/* Submit buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </div>
  );
}
