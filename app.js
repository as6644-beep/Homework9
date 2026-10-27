// Portfolio data
const portfolioName = "Andy SE";

// Step 1: skills array (each skill has an id, a name, and a category)
let skills = [
  { id: 1, name: "HTML/CSS", category: "web" },
  { id: 2, name: "Bootstrap", category: "web" },
  { id: 3, name: "Git", category: "web" },
  { id: 4, name: "Python", category: "it" },
  { id: 5, name: "Cybersecurity", category: "it" },
  { id: 6, name: "Troubleshooting", category: "it" },
  { id: 7, name: "Communication", category: "pro" },
  { id: 8, name: "Project Management", category: "pro" },
  { id: 9, name: "Bilingual", category: "pro" }
];
let nextSkillId = 10;

const categoryNames = {
  web: "Web Development",
  it: "Programming & IT",
  pro: "Professional"
};

// Step 2: navigation menu items
const navItems = [
  { label: "Summary", target: "#about" },
  { label: "Education", target: "#education" },
  { label: "Skills", target: "#skills" },
  { label: "Projects", target: "#projects" },
  { label: "Contact", target: "#contact" },
  { label: "Settings", target: "#settings" }
];

// Step 3: projects array of objects
const projects = [
  {
    title: "Design Project",
    description: "Designed Instagram graphics for Coconino County using Canva.",
    deadline: new Date("09/15/2026"),
    imageURL: "images/project2_ss.png",
    modal: "#designModal"
  },
  {
    title: "Campus Event Tracker",
    description: "A web app for tracking student organization events across campus.",
    deadline: new Date("12/15/2026"),
    imageURL: "images/event_tracker.svg",
    modal: ""
  },
  {
    title: "Portfolio Website",
    description: "Built and deployed this portfolio with HTML, CSS, Bootstrap, JavaScript, and jQuery.",
    deadline: new Date("12/11/2026"),
    imageURL: "images/portfolio_ss.png",
    modal: "#portfolioModal"
  }
];

// Table data
const educationRows = [
  { school: "Northern Arizona University", degree: "B.S. Political Science and Software Engineering, Minor in Journalism & Physics", start: "Aug 2025", end: "May 2029" }
];

const experienceRows = [
  { role: "Student Systems Administration Assistant", place: "NAU ITS", start: "Mar 2026", end: "Present" },
  { role: "CAL Career & Marketing Intern", place: "NAU College of Social and Behavioral Sciences", start: "Feb 2026", end: "Present" },
  { role: "Interns to Scholars Fellow, NORPAK", place: "NAU Office of Undergraduate Research and Creative Activity", start: "Jan 2026", end: "Present" },
  { role: "AI Student Ambassador", place: "NAU Cline Library", start: "Jan 2026", end: "May 2026" },
  { role: "Student Financial Aid Worker", place: "NAU Office of Scholarships and Financial Aid", start: "Sep 2025", end: "Aug 2026" },
  { role: "Teaching Assistant", place: "NAU Department of Comparative Cultural Studies", start: "Aug 2025", end: "Present" }
];

// Resume download counter
let resumeDownloads = 0;

// Navbar height in px (matches --nav-h in styles.css)
const navHeight = 56;


/* ---------- Greeting ---------- */

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

function showGreeting() {
  $("#greeting").text(getTimeOfDay() + "! Hello, my name is " + portfolioName + "! Welcome to my portfolio!");
}


/* ---------- Step 1: Skills ---------- */

// Shows a message under the form
function showMessage(text) {
  $("#skill-message").text(text);
}

// Higher-order function: checks a name, then calls onValid or onError
function validateSkill(name, ignoreId, onValid, onError) {
  if (name === "") {
    onError("Please type a skill first.");
    return;
  }

  const alreadyListed = skills.some(function (skill) {
    return skill.id !== ignoreId && skill.name.toLowerCase() === name.toLowerCase();
  });

  if (alreadyListed) {
    onError(name + " is already listed.");
    return;
  }

  onValid(name);
}

// Higher-order function: the callback returns the new array, then the list redraws
function updateSkills(changeArray) {
  skills = changeArray(skills);
  renderSkills();
}

// Bonus: keeps only skills that contain the search text
function getVisibleSkills() {
  const searchText = $("#skillSearch").val().trim().toLowerCase();
  return skills.filter(function (skill) {
    return skill.name.toLowerCase().includes(searchText);
  });
}

// Builds one skill item: name button (edit) + delete button
function makeSkillItem(skill) {
  const $item = $("<li>", { class: "skill-item", "data-id": skill.id });
  const $name = $("<button>", {
    type: "button",
    class: "skill-name",
    text: skill.name,
    title: "Click to edit"
  });
  const $delete = $("<button>", {
    type: "button",
    class: "skill-delete",
    "aria-label": "Remove " + skill.name,
    html: "&times;"
  });
  return $item.append($name, $delete);
}

// Draws the skills array into the three lists
function renderSkills() {
  $(".skill-list").empty();

  const visibleSkills = getVisibleSkills();
  visibleSkills.forEach(function (skill) {
    $("#skills-" + skill.category).append(makeSkillItem(skill));
  });

  $("#search-empty").toggle(visibleSkills.length === 0);
}

function findSkillItem(id) {
  return $('.skill-item[data-id="' + id + '"]');
}

// Add Skill
function addSkill() {
  const name = $("#skill-input").val().trim();
  const category = $("#skill-category").val();

  validateSkill(name, null, function (validName) {
    const newSkill = { id: nextSkillId, name: validName, category: category };
    nextSkillId = nextSkillId + 1;

    // Clear the search so the new skill shows
    $("#skillSearch").val("");

    updateSkills(function (list) {
      return list.concat(newSkill);
    });

    findSkillItem(newSkill.id).hide().fadeIn(400);
    $("#skill-input").val("");
    showMessage(validName + " added to " + categoryNames[category] + ".");
  }, showMessage);
}

// Remove Skill
function removeSkill() {
  const $item = $(this).closest(".skill-item");
  const id = $item.data("id");
  const removedName = $item.find(".skill-name").text();

  $item.slideUp(300, function () {
    updateSkills(function (list) {
      return list.filter(function (skill) {
        return skill.id !== id;
      });
    });
    showMessage(removedName + " removed.");
  });
}

// Edit Skill: swap the name for a text box
function startEdit() {
  const $item = $(this).closest(".skill-item");
  const id = $item.data("id");
  const oldName = $(this).text();
  let finished = false;

  const $input = $("<input>", {
    type: "text",
    class: "form-control form-control-sm skill-edit",
    value: oldName,
    "aria-label": "Edit " + oldName
  });

  $(this).replaceWith($input);
  $input.trigger("focus").trigger("select");

  $input.on("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      finished = true;
      saveEdit(id, oldName, $input.val());
    } else if (event.key === "Escape") {
      finished = true;
      renderSkills();
    }
  });

  $input.on("blur", function () {
    if (!finished) {
      finished = true;
      saveEdit(id, oldName, $input.val());
    }
  });
}

function saveEdit(id, oldName, typedName) {
  const newName = typedName.trim();

  if (newName === oldName) {
    renderSkills();
    return;
  }

  validateSkill(newName, id, function (validName) {
    updateSkills(function (list) {
      return list.map(function (skill) {
        if (skill.id === id) {
          return { id: skill.id, name: validName, category: skill.category };
        }
        return skill;
      });
    });
    findSkillItem(id).hide().fadeIn(400);
    showMessage(oldName + " changed to " + validName + ".");
  }, function (error) {
    renderSkills();
    showMessage(error);
  });
}


/* ---------- Step 4: Keyboard events ---------- */

function clearSkillForm() {
  $("#skill-form").find("input").val("");
  $("#skill-category").prop("selectedIndex", 0);
  showMessage("");
}

// Callback for keydown on the skill input
function handleSkillKeys(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addSkill();
  } else if (event.key === "Escape") {
    clearSkillForm();
  }
}


/* ---------- Step 2: Navigation ---------- */

function renderNav() {
  for (let i = 0; i < navItems.length; i++) {
    const $link = $("<a>", {
      class: "nav-link",
      href: navItems[i].target,
      text: navItems[i].label
    });
    $("#nav-list").append($("<li>", { class: "nav-item" }).append($link));
  }

  // Let Bootstrap scrollspy see the new links
  bootstrap.ScrollSpy.getOrCreateInstance(document.body).refresh();
}

function closeMobileMenu() {
  const menu = bootstrap.Collapse.getInstance(document.getElementById("navLinks"));
  if (menu) {
    menu.hide();
  }
}

// Smooth scroll with jQuery animate()
function scrollToSection(event) {
  event.preventDefault();
  const target = $(this).attr("href");

  $("html, body").stop().animate({
    scrollTop: $(target).offset().top - navHeight
  }, 600);

  closeMobileMenu();
}


/* ---------- Step 3: Projects ---------- */

function formatDate(date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// Compares a deadline with today
function getProjectStatus(deadline) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (deadline.getTime() > today.getTime()) {
    return "Ongoing";
  } else if (deadline.getTime() < today.getTime()) {
    return "Completed";
  } else {
    return "Due Today";
  }
}

function renderProjects() {
  $("#project-list").empty();

  for (let i = 0; i < projects.length; i++) {
    const status = getProjectStatus(projects[i].deadline);
    const statusClass = {
      "Ongoing": "status-ongoing",
      "Completed": "status-completed",
      "Due Today": "status-due"
    };

    const $body = $("<div>", { class: "card-body d-flex flex-column" }).append(
      $("<h3>", { class: "card-title h5", text: projects[i].title }),
      $("<p>", { class: "card-text", text: projects[i].description }),
      $("<p>", { class: "card-text mb-2" }).append(
        $("<span>", { class: "fw-semibold", text: "Deadline: " }),
        formatDate(projects[i].deadline)
      ),
      $("<p>", { class: "card-text" }).append(
        $("<span>", { class: "badge status-badge " + statusClass[status], text: status })
      )
    );

    if (projects[i].modal !== "") {
      $body.append($("<button>", {
        type: "button",
        class: "btn btn-outline-ocean mt-auto align-self-start",
        text: "View details",
        "data-bs-toggle": "modal",
        "data-bs-target": projects[i].modal
      }));
    }

    const $card = $("<article>", { class: "card project-card h-100 shadow-sm" }).append(
      $("<img>", { class: "card-img-top", src: projects[i].imageURL, alt: projects[i].title + " image" }),
      $body
    );

    $("#project-list").append($("<div>", { class: "col" }).append($card));
  }
}

// Comparator sort by deadline
function sortProjects(order) {
  projects.sort(function (a, b) {
    if (order === "earliest") {
      return a.deadline - b.deadline;
    }
    return b.deadline - a.deadline;
  });

  renderProjects();
  $("#project-list .col").hide().fadeIn(400);

  $("#sort-earliest").toggleClass("active", order === "earliest").attr("aria-pressed", order === "earliest");
  $("#sort-latest").toggleClass("active", order === "latest").attr("aria-pressed", order === "latest");
}


/* ---------- Resume download counter ---------- */

function showDownloadCount() {
  let word = "times";
  if (resumeDownloads === 1) {
    word = "time";
  }
  $("#download-count").text("Resume downloaded " + resumeDownloads + " " + word);
}

function countDownload() {
  resumeDownloads = resumeDownloads + 1;
  showDownloadCount();
}


/* ---------- Education and Experience tables ---------- */

function buildTable(boxId, headers, rows, keys) {
  const $headRow = $("<tr>");
  for (let i = 0; i < headers.length; i++) {
    $headRow.append($("<th>", { scope: "col", text: headers[i] }));
  }

  const $body = $("<tbody>");
  for (let i = 0; i < rows.length; i++) {
    const $row = $("<tr>");
    for (let j = 0; j < keys.length; j++) {
      const $cell = $("<td>", { text: rows[i][keys[j]] });
      if (keys[j] === "start" || keys[j] === "end") {
        $cell.addClass("text-nowrap");
      }
      $row.append($cell);
    }
    $body.append($row);
  }

  const $table = $("<table>", { class: "table table-striped table-hover align-middle mb-0" }).append(
    $("<thead>", { class: "table-ocean" }).append($headRow),
    $body
  );

  $("#" + boxId).append($("<div>", { class: "table-responsive" }).append($table));
}


/* ---------- Display settings ---------- */

const lightBackground = "#f7fbfc";
const darkBackground = "#0b1f27";

function toggleTheme() {
  $("body").toggleClass("dark-mode").css("background-color", "");

  if ($("body").hasClass("dark-mode")) {
    $("#theme-toggle").text("Light Mode");
    $("#bg-color-input").val(darkBackground);
  } else {
    $("#theme-toggle").text("Dark Mode");
    $("#bg-color-input").val(lightBackground);
  }
}

function changeFontSize() {
  const size = $("#font-size-input").val();
  $("html").css("font-size", size + "px");
  $("#font-size-value").text(size + "px");
}

function changeBackground() {
  $("body").css("background-color", $("#bg-color-input").val());
}

function resetDisplay() {
  $("body").removeClass("dark-mode").css("background-color", "");
  $("html").css("font-size", "");
  $("#theme-toggle").text("Dark Mode");
  $("#font-size-input").val(16);
  $("#font-size-value").text("16px");
  $("#bg-color-input").val(lightBackground);
}


/* ---------- Start ---------- */

// Hide the loader when everything has loaded
$(window).on("load", function () {
  $("#page-loader").addClass("loaded");
});

// Runs when the page is ready
$(function () {
  showGreeting();
  renderNav();
  renderSkills();
  renderProjects();
  buildTable("education-table", ["School", "Degree", "Start", "End"], educationRows, ["school", "degree", "start", "end"]);
  buildTable("experience-table", ["Job Title", "Organization", "Start", "End"], experienceRows, ["role", "place", "start", "end"]);
  showDownloadCount();

  // Step 1: add, edit, remove
  $("#skill-form").on("submit", function (event) {
    event.preventDefault();
    addSkill();
  });
  $(".skill-list").on("click", ".skill-name", startEdit);
  $(".skill-list").on("click", ".skill-delete", removeSkill);

  // Step 2: smooth scrolling links
  $("#nav-list").on("click", ".nav-link", scrollToSection);
  $(".navbar-brand, .back-to-top").on("click", scrollToSection);

  // Step 3: sort buttons
  $("#sort-earliest").on("click", function () {
    sortProjects("earliest");
  });
  $("#sort-latest").on("click", function () {
    sortProjects("latest");
  });

  // Step 4: keyboard shortcuts on the skill input
  $("#skill-input").on("keydown", handleSkillKeys);

  // Bonus: live search
  $("#skillSearch").on("input", renderSkills);

  // Resume counter and display settings
  $(".resume-download").on("click", countDownload);
  $("#theme-toggle").on("click", toggleTheme);
  $("#font-size-input").on("input", changeFontSize);
  $("#bg-color-input").on("input", changeBackground);
  $("#reset-display").on("click", resetDisplay);
});
