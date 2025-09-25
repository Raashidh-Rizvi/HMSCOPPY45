package com.hmsv1.config;

import com.hmsv1.entity.User;
import com.hmsv1.entity.Patient;
import com.hmsv1.entity.Appointment;
import com.hmsv1.entity.Billing;
import com.hmsv1.entity.MedicationPrescription;
import com.hmsv1.entity.VitalSignsLog;
import com.hmsv1.entity.InventoryItem;
import com.hmsv1.repository.UserRepository;
import com.hmsv1.repository.PatientRepository;
import com.hmsv1.repository.AppointmentRepository;
import com.hmsv1.repository.BillingRepository;
import com.hmsv1.repository.MedicationPrescriptionRepository;
import com.hmsv1.repository.VitalSignsLogRepository;
import com.hmsv1.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private MedicationPrescriptionRepository prescriptionRepository;

    @Autowired
    private VitalSignsLogRepository vitalSignsRepository;

    @Autowired
    private InventoryItemRepository inventoryRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== DATABASE INITIALIZATION ===");

        // Check what users exist first
        List<User> existingUsers = userRepository.findAll();
        System.out.println("Existing users count: " + existingUsers.size());
        existingUsers.forEach(user -> {
            System.out.println("User: ID=" + user.getId() +
                    ", Email='" + user.getEmail() + "'" +
                    ", Username='" + user.getUsername() + "'" +
                    ", Name='" + user.getName() + "'");
        });

        String adminEmail = "admin@hospital.com";
        Optional<User> existingAdmin = userRepository.findByEmail(adminEmail);

        if (existingAdmin.isEmpty()) {
            System.out.println("Creating admin user...");

            User admin = new User();
            admin.setUsername("admin@hospital.com"); // Set username same as email
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMINISTRATOR);
            admin.setName("System Administrator");
            admin.setEmail(adminEmail);
            admin.setPhone("+1-555-0001");

            User savedAdmin = userRepository.save(admin);

            System.out.println("=== ADMIN USER CREATED ===");
            System.out.println("ID: " + savedAdmin.getId());
            System.out.println("Username: " + savedAdmin.getUsername());
            System.out.println("Email: " + savedAdmin.getEmail());
            System.out.println("Name: " + savedAdmin.getName());
            System.out.println("Password Hash: " + savedAdmin.getPassword());
            System.out.println("Role: " + savedAdmin.getRole());
            System.out.println("==========================");
        } else {
            System.out.println("Admin user already exists:");
            User admin = existingAdmin.get();
            System.out.println("ID: " + admin.getId());
            System.out.println("Username: " + admin.getUsername());
            System.out.println("Email: " + admin.getEmail());
            System.out.println("Name: " + admin.getName());
            System.out.println("Password Hash: " + admin.getPassword());
        }

        // Test the findByEmail method
        Optional<User> testUser = userRepository.findByEmail(adminEmail);
        System.out.println("Test findByEmail('" + adminEmail + "'): " + testUser.isPresent());

        System.out.println("=== DATABASE INITIALIZATION COMPLETE ===");
        
        // Initialize sample data
        initializeSampleData();
    }
    
    private void initializeSampleData() {
        // Create sample patients if none exist
        if (patientRepository.count() == 0) {
            System.out.println("Creating sample patients...");
            
            Patient patient1 = new Patient();
            patient1.setFirstName("John");
            patient1.setLastName("Doe");
            patient1.setDob(LocalDate.of(1985, 6, 15));
            patient1.setGender("Male");
            patient1.setAddress("123 Main St, City, State");
            patient1.setPhone("+1-555-0123");
            patient1.setEmail("john.doe@email.com");
            patient1.setRegistrationDate(LocalDate.now().minusDays(30));
            patientRepository.save(patient1);
            
            Patient patient2 = new Patient();
            patient2.setFirstName("Jane");
            patient2.setLastName("Smith");
            patient2.setDob(LocalDate.of(1990, 3, 22));
            patient2.setGender("Female");
            patient2.setAddress("456 Oak Ave, City, State");
            patient2.setPhone("+1-555-0124");
            patient2.setEmail("jane.smith@email.com");
            patient2.setRegistrationDate(LocalDate.now().minusDays(15));
            patientRepository.save(patient2);
            
            Patient patient3 = new Patient();
            patient3.setFirstName("Robert");
            patient3.setLastName("Johnson");
            patient3.setDob(LocalDate.of(1978, 11, 8));
            patient3.setGender("Male");
            patient3.setAddress("789 Pine St, City, State");
            patient3.setPhone("+1-555-0125");
            patient3.setEmail("robert.johnson@email.com");
            patient3.setRegistrationDate(LocalDate.now().minusDays(5));
            patientRepository.save(patient3);
            
            System.out.println("Sample patients created successfully!");
        }
        
        // Create sample staff if only admin exists
        if (userRepository.count() == 1) {
            System.out.println("Creating sample staff...");
            
            User doctor = new User();
            doctor.setUsername("dr.wilson@hospital.com");
            doctor.setPassword(passwordEncoder.encode("doctor123"));
            doctor.setRole(User.Role.DOCTOR);
            doctor.setName("Dr. Sarah Wilson");
            doctor.setEmail("dr.wilson@hospital.com");
            doctor.setPhone("+1-555-0201");
            userRepository.save(doctor);
            
            User nurse = new User();
            nurse.setUsername("nurse.brown@hospital.com");
            nurse.setPassword(passwordEncoder.encode("nurse123"));
            nurse.setRole(User.Role.NURSE);
            nurse.setName("Nurse Michael Brown");
            nurse.setEmail("nurse.brown@hospital.com");
            nurse.setPhone("+1-555-0301");
            userRepository.save(nurse);
            
            User receptionist = new User();
            receptionist.setUsername("reception@hospital.com");
            receptionist.setPassword(passwordEncoder.encode("reception123"));
            receptionist.setRole(User.Role.RECEPTIONIST);
            receptionist.setName("Lisa Davis");
            receptionist.setEmail("reception@hospital.com");
            receptionist.setPhone("+1-555-0401");
            userRepository.save(receptionist);
            
            User pharmacist = new User();
            pharmacist.setUsername("pharmacy@hospital.com");
            pharmacist.setPassword(passwordEncoder.encode("pharmacy123"));
            pharmacist.setRole(User.Role.PHARMACIST);
            pharmacist.setName("David Martinez");
            pharmacist.setEmail("pharmacy@hospital.com");
            pharmacist.setPhone("+1-555-0501");
            userRepository.save(pharmacist);
            
            System.out.println("Sample staff created successfully!");
        }

        // Create sample appointments
        if (appointmentRepository.count() == 0) {
            System.out.println("Creating sample appointments...");
            createSampleAppointments();
        }

        // Create sample billing records
        if (billingRepository.count() == 0) {
            System.out.println("Creating sample billing records...");
            createSampleBillings();
        }

        // Create sample prescriptions
        if (prescriptionRepository.count() == 0) {
            System.out.println("Creating sample prescriptions...");
            createSamplePrescriptions();
        }

        // Create sample vital signs
        if (vitalSignsRepository.count() == 0) {
            System.out.println("Creating sample vital signs...");
            createSampleVitalSigns();
        }

        // Create sample inventory
        if (inventoryRepository.count() == 0) {
            System.out.println("Creating sample inventory...");
            createSampleInventory();
        }
        System.out.println("All sample data created successfully!");
    }

    private void createSampleAppointments() {
        List<Patient> patients = patientRepository.findAll();
        List<User> doctors = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.DOCTOR)
                .toList();

        if (!patients.isEmpty() && !doctors.isEmpty()) {
            Appointment apt1 = new Appointment();
            apt1.setPatient(patients.get(0));
            apt1.setDoctor(doctors.get(0));
            apt1.setAppointmentDateTime(LocalDateTime.now().plusHours(2));
            apt1.setStatus(Appointment.Status.SCHEDULED);
            appointmentRepository.save(apt1);

            Appointment apt2 = new Appointment();
            apt2.setPatient(patients.get(1));
            apt2.setDoctor(doctors.get(0));
            apt2.setAppointmentDateTime(LocalDateTime.now().plusDays(1));
            apt2.setStatus(Appointment.Status.SCHEDULED);
            appointmentRepository.save(apt2);
        }
    }

    private void createSampleBillings() {
        List<Patient> patients = patientRepository.findAll();

        if (!patients.isEmpty()) {
            Billing bill1 = new Billing();
            bill1.setPatient(patients.get(0));
            bill1.setAmount(250.00);
            bill1.setBillingDate(LocalDate.now().minusDays(5));
            bill1.setStatus(Billing.Status.PAID);
            billingRepository.save(bill1);

            Billing bill2 = new Billing();
            bill2.setPatient(patients.get(1));
            bill2.setAmount(150.00);
            bill2.setBillingDate(LocalDate.now().minusDays(2));
            bill2.setStatus(Billing.Status.UNPAID);
            billingRepository.save(bill2);
        }
    }

    private void createSamplePrescriptions() {
        List<Patient> patients = patientRepository.findAll();
        List<User> doctors = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.DOCTOR)
                .toList();

        if (!patients.isEmpty() && !doctors.isEmpty()) {
            MedicationPrescription prescription1 = new MedicationPrescription();
            prescription1.setPatient(patients.get(0));
            prescription1.setDoctor(doctors.get(0));
            prescription1.setMedicationName("Amoxicillin");
            prescription1.setDosage("500mg");
            prescription1.setFrequency("Twice daily");
            prescription1.setStartDate(LocalDate.now());
            prescription1.setEndDate(LocalDate.now().plusDays(7));
            prescriptionRepository.save(prescription1);

            MedicationPrescription prescription2 = new MedicationPrescription();
            prescription2.setPatient(patients.get(1));
            prescription2.setDoctor(doctors.get(0));
            prescription2.setMedicationName("Ibuprofen");
            prescription2.setDosage("200mg");
            prescription2.setFrequency("Three times daily");
            prescription2.setStartDate(LocalDate.now().minusDays(2));
            prescription2.setEndDate(LocalDate.now().plusDays(5));
            prescriptionRepository.save(prescription2);
        }
    }

    private void createSampleVitalSigns() {
        List<Patient> patients = patientRepository.findAll();
        List<User> nurses = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.NURSE)
                .toList();

        if (!patients.isEmpty() && !nurses.isEmpty()) {
            VitalSignsLog vital1 = new VitalSignsLog();
            vital1.setPatient(patients.get(0));
            vital1.setNurse(nurses.get(0));
            vital1.setTemperature(98.6);
            vital1.setBloodPressure("120/80");
            vital1.setHeartRate(72);
            vital1.setRespiratoryRate(16);
            vital1.setLogDateTime(LocalDateTime.now().minusHours(2));
            vitalSignsRepository.save(vital1);

            VitalSignsLog vital2 = new VitalSignsLog();
            vital2.setPatient(patients.get(1));
            vital2.setNurse(nurses.get(0));
            vital2.setTemperature(99.2);
            vital2.setBloodPressure("130/85");
            vital2.setHeartRate(78);
            vital2.setRespiratoryRate(18);
            vital2.setLogDateTime(LocalDateTime.now().minusHours(1));
            vitalSignsRepository.save(vital2);
        }
    }

    private void createSampleInventory() {
        InventoryItem item1 = new InventoryItem();
        item1.setItemName("Paracetamol 500mg");
        item1.setQuantityAvailable(150);
        item1.setReorderLevel(50);
        item1.setLastRestockDate(LocalDate.now().minusDays(10));
        inventoryRepository.save(item1);

        InventoryItem item2 = new InventoryItem();
        item2.setItemName("Surgical Gloves");
        item2.setQuantityAvailable(25);
        item2.setReorderLevel(100);
        item2.setLastRestockDate(LocalDate.now().minusDays(15));
        inventoryRepository.save(item2);

        InventoryItem item3 = new InventoryItem();
        item3.setItemName("Bandages");
        item3.setQuantityAvailable(200);
        item3.setReorderLevel(75);
        item3.setLastRestockDate(LocalDate.now().minusDays(5));
        inventoryRepository.save(item3);
    }
}