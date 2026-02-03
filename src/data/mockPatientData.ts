
export const mockHospitals = [
    {
        id: 1,
        name: "City General Hospital",
        distance: "2.5 km",
        fees: 500,
        beds: {
            free: 12,
            occupied: 45,
            cleaning: 5
        },
        waitingTime: "15-20 mins",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "St. Mary's Medical Center",
        distance: "4.0 km",
        fees: 800,
        beds: {
            free: 8,
            occupied: 60,
            cleaning: 3
        },
        waitingTime: "30-45 mins",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Community Health Clinic",
        distance: "1.2 km",
        fees: 200,
        beds: {
            free: 20,
            occupied: 15,
            cleaning: 2
        },
        waitingTime: "10-15 mins",
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop"
    }
];

export const mockDoctors = [
    {
        id: 1,
        name: "Dr. Sarah Wilson",
        specialty: "Cardiologist",
        experience: 12,
        rating: 4.9,
        availableSlots: ["10:00 AM", "11:30 AM", "2:00 PM"],
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
        hospitalId: 1
    },
    {
        id: 2,
        name: "Dr. James Chen",
        specialty: "General Physician",
        experience: 8,
        rating: 4.7,
        availableSlots: ["9:00 AM", "10:30 AM", "3:00 PM"],
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop",
        hospitalId: 1
    },
    {
        id: 3,
        name: "Dr. Emily Parker",
        specialty: "Neurologist",
        experience: 15,
        rating: 4.8,
        availableSlots: ["11:00 AM", "1:00 PM", "4:30 PM"],
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&auto=format&fit=crop",
        hospitalId: 2
    },
    {
        id: 4,
        name: "Dr. Robert Smith",
        specialty: "Orthopedic",
        experience: 20,
        rating: 4.6,
        availableSlots: ["10:15 AM", "12:45 PM", "3:15 PM"],
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop",
        hospitalId: 2
    },
    {
        id: 5,
        name: "Dr. Lisa Wong",
        specialty: "Pediatrician",
        experience: 10,
        rating: 4.9,
        availableSlots: ["9:30 AM", "11:00 AM", "2:30 PM"],
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
        hospitalId: 3
    }
];
