import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/app/components/ui/form';
import { Button } from "@/app/components/ui/Button";
import { Input } from '@/app/components/ui/input';
import { useForm, UseFormReturn } from 'react-hook-form';

interface IntakeFormProps {

    form: UseFormReturn<{ Calories: number; Carbs: number; Fats: number; Proteins: number }>,

    onSubmit: (values: { Calories: number; Carbs: number; Fats: number; Proteins: number }) => void;

}
    

const IntakeForm = ({ form, onSubmit }: IntakeFormProps) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {['Calories', 'Carbs', 'Proteins', 'Fats'].map((field) => (
        <FormField
          key={field}
          control={form.control}
          name={field as 'Calories' | 'Carbs' | 'Proteins' | 'Fats'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{field.name}</FormLabel>
              <FormControl>
                <Input type='number' min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Button type="submit">Submit</Button>
    </form>
  </Form>
);

export default IntakeForm;