---
title: "Refreshing My Personal Developer Environment"
categories: Blog
tags:
  - Windows
  - Dev Environment
excerpt: >-
  Frustrated with my sluggish Windows setup, I did a full reset. This post covers what went wrong, how I fixed it, and how I automated my dev environment.
---

## Introduction

A few weeks ago, I finally hit my breaking point with my Windows setup. My laptop — once a fast, clean development machine — had become a sluggish, chaotic mess. Programs were installed inconsistently, background processes were eating up resources, and my folder structure was... let’s just say, "improvised."

I tried quick fixes — uninstalling bloatware, disabling startup apps, running performance checkers — but nothing made a real difference. So, I did what any sane (or slightly desperate) developer would do: I backed up what I needed onto an external SSD, hit the nuclear reset button, and started fresh.

This blog is about how I went from a frustrating, poorly set-up machine to a clean, streamlined developer environment. I’ll walk through what went wrong, how I fixed it, and — most importantly — how I automated the setup so I never have to go through this pain again. If your Windows setup has been slowly rotting over time, this might help you too.

## The initial state of things

First, let's quantify how bad things actually were. Sadly, I forgot to actually capture proof of what I am giving below so you'll just have to take my word for it.

- **Performance**: RAM usage idled at about 80% on my 8GB machine and my CPU usage wasn't much better. This meant once I had just VS Code and Docker running, my laptops fans were screaming for mercy.
- **Battery**: With so many background tasks (bloatware, misconfigured startup apps) and other poorly configured settings, my battery life was practically non-existant and required me to be plugged into a wall constantly.
- **Organisation**: Perhaps one of my biggest pain points. This issue ranged from (somehow) having multiple versions of software installed (e.g. Visual Studio 2020 / 2022) to having poorly organised folders, making finding anything difficult.

## Fixing the mess

Once I had reset my laptop, I wanted to be intentional about how I set things up this time. I focused on three main goals:

1. **Minimising bloat** – Keeping unnecessary software and background processes to a minimum.
2. **Improving organisation** – Ensuring a logical, clean folder structure and avoiding redundant installations.
3. **Automating setup** – Making future resets easier with scripts and package managers.

### Essential System Tweaks

Before installing anything, I made sure to configure Windows properly to improve performance and usability:

- **Dark Mode**: Set via Settings > Personalisation > Colours > Choose your mode > Dark (just a personal preference).
- **Taskbar Cleanup**: Disabled unnecessary elements (Settings > Personalisation > Taskbar > Search: Hide and Task view: Off).
- **Reduced Visual Effects**: Disabled animations for a snappier UI (Settings > Accessibility > Visual effects > Animation effects: Off).
- **Windows Update**: Ran all available updates (Settings > Windows Update).
- **Updated Drivers**: Lenovo have a pre-installed tool called Lenovo Vantage which makes this easy.
- **Startup Optimisation**: Disabled unnecessary startup apps (Task Manager > Startup Apps).

### Installing Essential Software

Rather than manually installing each program, I leveraged Windows Package Manager (winget) wherever possible. Here’s the core software I installed:

```shell
winget install -e --id=Google.Chrome
winget install -e --id=Microsoft.VisualStudioCode
winget install -e --id=Microsoft.PowerToys
winget install -e --id=Notion.Notion
```

Some software still required manual intervention:

- **iCloud (via Microsoft Store)** – Installed to sync photos and notes, plus the Chrome password extension.
- **Uninstalled OneDrive** – Since I don’t use it for personal storage. Unfortunately this can't be (easily) fully uninstalled, so I settled with disabling it as much as possible.

### Keeping a Clean Development Environment

One of my biggest mistakes in the past was cluttering my system with development tools installed directly on Windows. This time, I took a different approach:

- **Using Docker for ephemeral environments** – Instead of installing Python, Node.js, or databases like PostgreSQL directly, I now use Docker containers to keep my system clean. For example:

  ```shell
  docker run --rm -it python:latest python
  ```

  This way, I always have access to the latest versions without polluting my machine.

- **Using Package Managers for Everything** – Where Docker wasn’t practical, I made sure to use proper package managers (e.g., nvm for Node.js, pyenv for Python) to easily switch between versions.

### Final Thoughts

With these changes, my laptop went from a sluggish, disorganised mess to a clean, efficient development environment. By keeping bloat to a minimum, improving organisation, and using automation, I’ve ensured that the next time I need to reset my machine, it will be far less painful. Best of all, my RAM usage went down from 80% to around 55%, making everything run much smoother.
