/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.City;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@WebServlet(name = "MyAccount", urlPatterns = {"/MyAccount"})
public class MyAccount extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession ses = req.getSession();
        if(ses != null && ses.getAttribute("user") != null){
            User user = (User)ses.getAttribute("user");
            JsonObject responseObject = new JsonObject();
            responseObject.addProperty("firstName", user.getFirst_name());
            responseObject.addProperty("lastName", user.getLast_name());
            responseObject.addProperty("mobile", user.getMobile());
            responseObject.addProperty("password", user.getPassword());
            
            String since = new SimpleDateFormat("MMM yyyy").format(user.getCreated_at());
            responseObject.addProperty("since", since);
            
            Gson gson = new Gson();
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            Criteria c = s.createCriteria(Address.class);
            c.add(Restrictions.eq("user", user));
            if(!c.list().isEmpty()){
                List<Address> addressList = c.list();
                responseObject.add("addressList", gson.toJsonTree(addressList));
            }
            
            String toJson = gson.toJson(responseObject);
            resp.setContentType("application/json");
            resp.getWriter().write(toJson);
        }else{
            System.out.println("noooooo");
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject userData = gson.fromJson(req.getReader(), JsonObject.class);
        
        String firstName = userData.get("firstName").getAsString();
        String lastName = userData.get("lastName").getAsString();
        String lineOne = userData.get("lineOne").getAsString();
        String lineTwo = userData.get("lineTwo").getAsString();
        String postalCode = userData.get("postalCode").getAsString();
        int cityId = userData.get("cityId").getAsInt();
        String mobile = userData.get("mobile").getAsString();
        String currentPassword = userData.get("currentPassword").getAsString();
        String newPassword = userData.get("newPassword").getAsString();
        String confirmPassword = userData.get("confirmPassword").getAsString();
        
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        
        if(firstName.isEmpty()){
            responseObject.addProperty("message", "First Name Can not be empty!");
        }else if(lastName.isEmpty()){
            responseObject.addProperty("message", "Last Name Can not be empty!");
        }else if(lineOne.isEmpty()){
            responseObject.addProperty("message", "Enter Line one!");
        }else if(lineTwo.isEmpty()){
            responseObject.addProperty("message", "Enter Line one!");
        }else if(postalCode.isEmpty()){
            responseObject.addProperty("message", "Enter postalCode!");
        }else if(!Util.isCodeValid(postalCode)){ /////
            responseObject.addProperty("message", "postal code not valid!");
        }else if(cityId == 0){
            responseObject.addProperty("message", "Select a city!");
        }else if(mobile.isEmpty()){
            responseObject.addProperty("message", "Mobile Can not be empty!");
        }else if(!Util.isMobileValid(mobile)){
            responseObject.addProperty("message", "Enter valid Mobile!");
        }else if(currentPassword.isEmpty()){
            responseObject.addProperty("message", "Enter your current password!");
        }else if(!newPassword.isEmpty() && !Util.isPasswordValid(newPassword)){
            responseObject.addProperty("message", "Password must contains at least uppercase, lowecase, "
                    + "number, special character and to be minimum eight characters long!");
        }else if(!newPassword.isEmpty() && newPassword.equals(currentPassword)){
            responseObject.addProperty("message", "new Password same as currentone!");
        }else if(!confirmPassword.isEmpty() && !Util.isPasswordValid(confirmPassword)){
            responseObject.addProperty("message", "Password must contains at least uppercase, lowecase, "
                    + "number, special character and to be minimum eight characters long!");
        }else if(!confirmPassword.equals(newPassword)){
            responseObject.addProperty("message", "Confirm password not match!");
        }else{
            HttpSession ses = req.getSession();

            if (ses.getAttribute("user") != null) {

                User u = (User) ses.getAttribute("user");  // get session user

                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();

                Criteria c = s.createCriteria(User.class);
                c.add(Restrictions.eq("email", u.getEmail()));  // session user email

                if (!c.list().isEmpty()) {

                    User u1 = (User) c.list().get(0);   // db user

                    u1.setFirst_name(firstName);
                    u1.setLast_name(lastName);
                    u1.setMobile(mobile);
                    if (!confirmPassword.isEmpty()) {
                        u1.setPassword(confirmPassword);
                    } else {
                        u1.setPassword(currentPassword);
                    }

                    City city = (City) s.load(City.class, cityId);   // primary key search
                    Address address = new Address();
                    address.setLineOne(lineOne);
                    address.setLineTwo(lineTwo);
                    address.setPostalCode(postalCode);
                    address.setCity(city);
                    address.setUser(u1);

                    // session-management
                    ses.setAttribute("user", u1);
                    // session-management

                    s.merge(u1);
                    s.save(address);

                    s.beginTransaction().commit();
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "User profile details update successfully!");
                    s.close();

                }

            }
        }
        
        String toJson = gson.toJson(responseObject);
        resp.setContentType("application/json");
        resp.getWriter().write(toJson);
        
    }
    
    
}
