// Complete the Index page component here
// Use chakra-ui and REST API for Supabase
import React, { useState, useEffect } from "react";
import { Box, Button, Input, VStack, Text, useToast, IconButton, Textarea, Heading } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";

const supabaseUrl = "https://mnwefvnykbgyhbdzpleh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud2Vmdm55a2JneWhiZHpwbGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyNzQ3MzQsImV4cCI6MjAyODg1MDczNH0.tnHysd1LqayzpQ1L-PImcvlkUmkNvocpMS7tS-hYZNg";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await fetch(`${supabaseUrl}/rest/v1/notes`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    });
    const data = await response.json();
    setNotes(data);
  };

  const createNote = async () => {
    const response = await fetch(`${supabaseUrl}/rest/v1/notes`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ note: newNote }),
    });
    const data = await response.json();
    setNotes([...notes, data[0]]);
    setNewNote("");
    toast({
      title: "Note created.",
      description: "Your note has been added.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const deleteNote = async (id) => {
    await fetch(`${supabaseUrl}/rest/v1/notes?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
      },
    });
    setNotes(notes.filter((note) => note.id !== id));
    toast({
      title: "Note deleted.",
      description: "Your note has been removed.",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={4} p={5}>
      <Heading mb={6}>Notes App</Heading>
      <Box>
        <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Type a new note here..." size="sm" />
        <Button leftIcon={<FaPlus />} colorScheme="teal" mt={2} onClick={createNote}>
          Add Note
        </Button>
      </Box>
      {notes.map((note) => (
        <Box key={note.id} p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
          <Text mb={2}>{note.note}</Text>
          <IconButton aria-label="Delete note" icon={<FaTrash />} colorScheme="red" onClick={() => deleteNote(note.id)} />
        </Box>
      ))}
    </VStack>
  );
};

export default Index;
