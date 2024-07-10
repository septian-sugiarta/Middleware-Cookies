"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface City {
  city_id: string;
  city_name: string;
}

interface Cost {
  service: string;
  cost: {
    etd: string;
    value: number;
  }[];
}

const formSchema = z.object({
  origin: z.string().min(1, { message: "Kota asal harus dipilih" }),
  destination: z.string().min(1, { message: "Kota tujuan harus dipilih" }),
  weight: z.number().min(1, { message: "Berat minimal 1 gram" }),
  courier: z.string().min(1, { message: "Kurir harus dipilih" }),
});

const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    cookies.remove('userEmail'); // Hapus cookie
    toast.success('Logout successful!');
    setTimeout(() => {
      router.push('/login'); // Arahkan ke halaman login
    }, 2000);
  };

  return logout;
};

export default function CekOngkir() {
  const [cities, setCities] = useState<City[]>([]);
  const [shippingCosts, setShippingCosts] = useState<Cost[]>([]);
  const logout = useLogout();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
      weight: 1000,
      courier: "",
    },
  });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("/api/cities");
        setCities(response.data.rajaongkir.results);
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Gagal mengambil data kota");
      }
    };

    fetchCities();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/check-costs", data);
      setShippingCosts(response.data.rajaongkir.results[0].costs);
    } catch (error) {
      console.error("Error checking costs:", error);
      toast.error("Gagal mengecek ongkos kirim");
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cek Ongkos Kirim</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kota Asal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kota asal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city: City) => (
                          <SelectItem key={city.city_id} value={city.city_id}>
                            {city.city_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kota Tujuan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kota tujuan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city: City) => (
                          <SelectItem key={city.city_id} value={city.city_id}>
                            {city.city_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Berat Barang (gram)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kurir</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kurir" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="jne">JNE</SelectItem>
                        <SelectItem value="pos">POS Indonesia</SelectItem>
                        <SelectItem value="tiki">TIKI</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Cek Ongkos Kirim</Button>
              <Button variant="destructive" onClick={logout}>Logout</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {shippingCosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil Pengecekan</CardTitle>
          </CardHeader>
          <CardContent>
            {shippingCosts.map((cost: Cost, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{cost.service}</h3>
                <p>Estimasi: {cost.cost[0].etd} hari</p>
                <p>Harga: Rp{cost.cost[0].value.toLocaleString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
