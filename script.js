// ==========================================
// SMART COMPLAINT PORTAL
// JavaScript
// ==========================================


// Get existing complaints from LocalStorage

let complaints =
    JSON.parse(localStorage.getItem("complaints")) || [];


// ==========================================
// Generate Complaint ID
// ==========================================

function generateComplaintId() {

    const randomNumber =
        Math.floor(100000 + Math.random() * 900000);

    return "SCP" + randomNumber;
}


// ==========================================
// Save Complaints
// ==========================================

function saveComplaints() {

    localStorage.setItem(
        "complaints",
        JSON.stringify(complaints)
    );
}


// ==========================================
// Submit Complaint
// ==========================================

document
    .getElementById("complaintForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const mobile =
            document.getElementById("mobile").value.trim();

        const category =
            document.getElementById("category").value;

        const location =
            document.getElementById("location").value.trim();

        const description =
            document.getElementById("description").value.trim();


        // Mobile validation

        if (!/^[0-9]{10}$/.test(mobile)) {

            alert(
                "Please enter a valid 10-digit mobile number."
            );

            return;
        }


        // Generate ID

        const complaintId =
            generateComplaintId();


        // Create complaint object

        const complaint = {

            id: complaintId,

            name: name,

            mobile: mobile,

            category: category,

            location: location,

            description: description,

            status: "Submitted",

            date: new Date().toLocaleString()

        };


        // Add complaint

        complaints.push(complaint);


        // Save

        saveComplaints();


        // Show success message

        document.getElementById(
            "generatedId"
        ).textContent = complaintId;


        document.getElementById(
            "successMessage"
        ).style.display = "block";


        // Reset form

        document
            .getElementById("complaintForm")
            .reset();


        // Refresh dashboard

        displayComplaints();


        // Scroll to success message

        document
            .getElementById("successMessage")
            .scrollIntoView({
                behavior: "smooth"
            });

    });


// ==========================================
// Track Complaint
// ==========================================

function trackComplaint() {

    const input =
        document
            .getElementById("trackId")
            .value
            .trim()
            .toUpperCase();


    const result =
        document.getElementById("trackResult");


    if (input === "") {

        result.innerHTML = `
            <div class="not-found">
                Please enter a Complaint ID.
            </div>
        `;

        return;
    }


    const complaint =
        complaints.find(
            item => item.id === input
        );


    if (!complaint) {

        result.innerHTML = `
            <div class="not-found">
                Complaint not found.
                Please check your Complaint ID.
            </div>
        `;

        return;
    }


    let statusClass =
        "status-submitted";


    if (complaint.status === "Under Review") {

        statusClass = "status-review";

    }


    if (complaint.status === "Resolved") {

        statusClass = "status-resolved";

    }


    result.innerHTML = `

        <div class="track-card">

            <h3>
                Complaint Details
            </h3>

            <p>
                <strong>Complaint ID:</strong>
                ${complaint.id}
            </p>

            <p>
                <strong>Category:</strong>
                ${complaint.category}
            </p>

            <p>
                <strong>Location:</strong>
                ${complaint.location}
            </p>

            <p>
                <strong>Description:</strong>
                ${complaint.description}
            </p>

            <p>
                <strong>Date:</strong>
                ${complaint.date}
            </p>

            <p>
                <strong>Status:</strong>

                <span class="status ${statusClass}">
                    ${complaint.status}
                </span>

            </p>

        </div>

    `;
}


// ==========================================
// Display Complaints
// ==========================================

function displayComplaints() {

    const list =
        document.getElementById("complaintList");


    const search =
        document
            .getElementById("searchComplaint")
            .value
            .toUpperCase();


    const filter =
        document
            .getElementById("statusFilter")
            .value;


    let filteredComplaints =
        complaints.filter(function(complaint) {

            const matchesSearch =
                complaint.id
                    .toUpperCase()
                    .includes(search);


            const matchesStatus =
                filter === "All" ||
                complaint.status === filter;


            return matchesSearch && matchesStatus;

        });


    if (filteredComplaints.length === 0) {

        list.innerHTML = `
            <p style="text-align:center;">
                No complaints found.
            </p>
        `;

        return;
    }


    list.innerHTML = "";


    filteredComplaints.forEach(function(complaint) {


        let statusClass =
            "status-submitted";


        if (complaint.status === "Under Review") {

            statusClass =
                "status-review";

        }


        if (complaint.status === "Resolved") {

            statusClass =
                "status-resolved";

        }


        const card =
            document.createElement("div");


        card.className =
            "complaint-card";


        card.innerHTML = `

            <h3>
                ${complaint.id}
            </h3>

            <p>
                <strong>Name:</strong>
                ${complaint.name}
            </p>

            <p>
                <strong>Category:</strong>
                ${complaint.category}
            </p>

            <p>
                <strong>Location:</strong>
                ${complaint.location}
            </p>

            <p>
                <strong>Description:</strong>
                ${complaint.description}
            </p>

            <p>
                <strong>Status:</strong>

                <span class="status ${statusClass}">
                    ${complaint.status}
                </span>

            </p>

            <p>
                <strong>Submitted:</strong>
                ${complaint.date}
            </p>

            <button
                class="delete-btn"
                onclick="deleteComplaint('${complaint.id}')"
            >
                Delete
            </button>

        `;


        list.appendChild(card);

    });

}


// ==========================================
// Delete Complaint
// ==========================================

function deleteComplaint(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this complaint?"
        );


    if (!confirmation) {

        return;

    }


    complaints =
        complaints.filter(
            complaint => complaint.id !== id
        );


    saveComplaints();


    displayComplaints();

}


// ==========================================
// Initial Display
// ==========================================

displayComplaints();

