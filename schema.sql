-- PostgreSQL Database Schema for Aesthetic Athlete Platform (Supabase)
-- Execute this script in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- WARNING: This script drops existing tables to ensure a clean setup.
-- If you have important data, please back it up first!

-- 0. Clean up existing tables and policies to prevent "relation already exists" or "column does not exist" errors
drop table if exists "Notifications" cascade;
drop table if exists "Achievements" cascade;
drop table if exists "StepLogs" cascade;
drop table if exists "WaterLogs" cascade;
drop table if exists "NutritionLogs" cascade;
drop table if exists "MeasurementLogs" cascade;
drop table if exists "WeightLogs" cascade;
drop table if exists "Goals" cascade;
drop table if exists "Exercises" cascade;
drop table if exists "Workouts" cascade;
drop table if exists "Users" cascade;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Profile Table (extends Supabase auth.users)
create table "Users" (
  "id" text primary key,
  "name" text not null,
  "email" text unique not null,
  "age" integer,
  "gender" text,
  "height" numeric,
  "weight" numeric,
  "fitness_goal" text,
  "fitness_level" text,
  "workout_frequency" text,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Workouts Table
create table "Workouts" (
  "id" text primary key,
  "user_id" text references "Users"("id") on delete cascade not null,
  "workout_name" text not null,
  "workout_type" text not null,
  "duration" integer not null, -- minutes
  "calories_burned" integer not null,
  "notes" text,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Exercises Table
create table "Exercises" (
  "id" text primary key,
  "workout_id" text references "Workouts"("id") on delete cascade not null,
  "exercise_name" text not null,
  "category" text not null, -- Muscle group e.g. "Chest"
  "sets" integer not null,
  "reps" integer not null,
  "weight" numeric not null, -- in kg
  "rest_time" integer, -- in seconds
  "notes" text
);

-- 4. Goals Table
create table "Goals" (
  "id" text primary key,
  "user_id" text references "Users"("id") on delete cascade not null,
  "goal_type" text not null, -- e.g. "Weight", "Workout", "Health"
  "title" text not null,
  "target_value" numeric not null,
  "current_value" numeric not null,
  "unit" text not null,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "estimated_completion" text
);

-- 5. WeightLogs Table
create table "WeightLogs" (
  "id" text primary key,
  "user_id" text references "Users"("id") on delete cascade not null,
  "weight" numeric not null,
  "date" text not null -- YYYY-MM-DD
);

-- 6. MeasurementLogs Table
create table "MeasurementLogs" (
  "id" text primary key,
  "user_id" text references "Users"("id") on delete cascade not null,
  "chest" numeric,
  "waist" numeric,
  "hips" numeric,
  "arms" numeric,
  "thighs" numeric,
  "date" text not null -- YYYY-MM-DD
);

-- 7. NutritionLogs Table
create table "NutritionLogs" (
  "id" text primary key,
  "user_id" text references "Users"("id") on delete cascade not null,
  "food_name" text not null,
  "quantity" text,
  "calories" numeric not null,
  "protein" numeric not null,
  "carbs" numeric not null,
  "fats" numeric not null,
  "date" text not null -- YYYY-MM-DD
);

-- 8. WaterLogs Table
create table "WaterLogs" (
  "id" text primary key,
  "user_id" text references "Users"("id") on delete cascade not null,
  "amount" numeric not null, -- ml
  "date" text not null -- YYYY-MM-DD
);

-- 9. StepLogs Table
create table "StepLogs" (
  "id" text primary key,
  "user_id" text references "Users"("id") on delete cascade not null,
  "steps" integer not null,
  "distance" numeric not null, -- km
  "date" text not null -- YYYY-MM-DD
);

-- 10. Achievements Table
create table "Achievements" (
  "id" text primary key,
  "user_id" text references "Users"("id") on delete cascade not null,
  "achievement_key" text not null,
  "unlocked_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Ensure that a user can only unlock each achievement key once
  unique("user_id", "achievement_key")
);

-- 11. Notifications Table
create table "Notifications" (
  "id" text primary key,
  "user_id" text references "Users"("id") on delete cascade not null,
  "type" text not null,
  "title" text not null,
  "message" text not null,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
  "read" boolean default false not null
);

-- Enable Row Level Security (RLS) on all tables for maximum security
alter table "Users" enable row level security;
alter table "Workouts" enable row level security;
alter table "Exercises" enable row level security;
alter table "Goals" enable row level security;
alter table "WeightLogs" enable row level security;
alter table "MeasurementLogs" enable row level security;
alter table "NutritionLogs" enable row level security;
alter table "WaterLogs" enable row level security;
alter table "StepLogs" enable row level security;
alter table "Achievements" enable row level security;
alter table "Notifications" enable row level security;

-- Row Level Security (RLS) Policies (Using explicit casing quotes to guarantee safety)
-- Users can read, insert, or update their own profile
create policy "Users can read own profile" on "Users" for select using (auth.uid()::text = "id");
create policy "Users can insert own profile" on "Users" for insert with check (auth.uid()::text = "id");
create policy "Users can update own profile" on "Users" for update using (auth.uid()::text = "id");

-- Workouts policies
create policy "Users can manage own workouts" on "Workouts" for all using (auth.uid()::text = "user_id");

-- Exercises policies
-- Exercises link to workouts. A user can manage exercises if they own the corresponding workout.
create policy "Users can manage exercises" on "Exercises" for all using (
  exists (
    select 1 from "Workouts" 
    where "Workouts"."id" = "Exercises"."workout_id" 
    and "Workouts"."user_id" = auth.uid()::text
  )
);

-- Goals policies
create policy "Users can manage own goals" on "Goals" for all using (auth.uid()::text = "user_id");

-- WeightLogs policies
create policy "Users can manage own weight logs" on "WeightLogs" for all using (auth.uid()::text = "user_id");

-- MeasurementLogs policies
create policy "Users can manage own measurement logs" on "MeasurementLogs" for all using (auth.uid()::text = "user_id");

-- NutritionLogs policies
create policy "Users can manage own nutrition logs" on "NutritionLogs" for all using (auth.uid()::text = "user_id");

-- WaterLogs policies
create policy "Users can manage own water logs" on "WaterLogs" for all using (auth.uid()::text = "user_id");

-- StepLogs policies
create policy "Users can manage own step logs" on "StepLogs" for all using (auth.uid()::text = "user_id");

-- Achievements policies
create policy "Users can manage own achievements" on "Achievements" for all using (auth.uid()::text = "user_id");

-- Notifications policies
create policy "Users can manage own notifications" on "Notifications" for all using (auth.uid()::text = "user_id");
