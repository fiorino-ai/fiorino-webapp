"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Wand2, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import confetti from "canvas-confetti";
import { useRealmsStore } from "@/stores/RealmStore";
import { Realm } from "@/types";

export const WelcomeScreen: React.FC = () => {
  const [realmName, setRealmName] = useState("");
  const [realmCreated, setRealmCreated] = useState<Realm | null>(null);
  const { createRealm, error, submitting, setActiveRealm } = useRealmsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newRealm = await createRealm({ name: realmName });
      if (!newRealm) {
        return;
      }
      console.log("Creating realm:", realmName);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8b5cf6", "#6d28d9", "#4c1d95"],
      });
      setRealmCreated(newRealm);
    } catch (error) {
      console.error(
        "Failed to create realm:",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  const handleGoToDashboard = () => {
    if (realmCreated) {
      setActiveRealm(realmCreated);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[black] via-[hsl(var(--card))] to-[black] overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md relative bg-card border">
          <motion.div
            className="absolute -top-12 right-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Wand2 size={48} className="text-violet-400" />
          </motion.div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">
              Welcome to Fiorino.AI
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              Where LLM billing becomes as smooth as silk and as clear as
              crystal!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {!realmCreated ? (
                <motion.div
                  key="create-realm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="mb-4 text-center text-gray-400">
                    Fiorino.AI: Making LLM cost tracking so intuitive, it's like
                    your AI got a degree in accounting!
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="realmName" className="text-gray-200">
                          Create Your First Realm
                        </Label>
                        <Input
                          id="realmName"
                          placeholder="Enter a magical realm name"
                          value={realmName}
                          onChange={(e) => setRealmName(e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <Alert
                              variant="destructive"
                              className="bg-red-900 border-red-800 text-red-200"
                            >
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <Button
                      type="submit"
                      className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          🪄
                        </motion.div>
                      ) : (
                        "Create Magical Realm"
                      )}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="realm-created"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center space-y-4">
                    <Sparkles className="h-12 w-12 text-violet-400 mx-auto" />
                    <h3 className="text-xl font-semibold text-white">
                      Congratulations! Your realm is ready!
                    </h3>
                    <p className="text-gray-300">
                      You've just taken your first step into the magical world
                      of efficient LLM cost tracking!
                    </p>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-200">Next steps:</p>
                      <ol className="list-decimal list-inside text-left text-gray-300">
                        <li>Create an API in your new realm</li>
                        <li>Use the API to start tracking LLM costs</li>
                        <li>
                          Watch as Fiorino.AI turns billing chaos into harmony!
                        </li>
                      </ol>
                    </div>
                    <Button
                      className="mt-4 bg-violet-600 hover:bg-violet-700 text-white"
                      onClick={handleGoToDashboard}
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-400">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              Fun fact: If LLMs could track their own costs, they'd probably
              bill in tokens of gratitude. Luckily, Fiorino.AI speaks both AI
              and finance!
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
