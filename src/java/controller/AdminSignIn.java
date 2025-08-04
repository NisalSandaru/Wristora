/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@WebServlet(name = "SignIn", urlPatterns = {"/SignIn"})
public class SignIn extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        
        Gson gson = new Gson();
        JsonObject signIn = gson.fromJson(req.getReader(), JsonObject.class);
        
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        
        final String email = signIn.get("email").getAsString();
        String password = signIn.get("password").getAsString();
        
        if (email.isEmpty()) {
            responseObject.addProperty("message", "Email can be empty!");
        } else if (!Util.isEmailValid(email)) {
            responseObject.addProperty("message", "Please enter a Valide email!");
        } else if (password.isEmpty()) {
            responseObject.addProperty("message", "Password cant be empty!");
        } else {
            Session s = HibernateUtil.getSessionFactory().openSession();
            Criteria c = s.createCriteria(User.class);

            Criterion crt1 = Restrictions.eq("email", email);
            Criterion crt2 = Restrictions.eq("password", password);

            c.add(crt1);
            c.add(crt2);
            
            if (c.list().isEmpty()) {
                responseObject.addProperty("message", "Invalide ceredentials!");
            } else {
                User u = (User) c.list().get(0);

                responseObject.addProperty("status", true);

                //Add session 
                HttpSession ses = req.getSession();

                if (!u.getVerification().equals("Verified")) { // not verifide

                    ses.setAttribute("email", email);

                    responseObject.addProperty("message", "1"); // Not Verifide User

                } else { //Verifide

                    ses.setAttribute("user", u);
                    responseObject.addProperty("message", "2"); // Verifide User

                }
            }
            s.close();
        }
        String responseText = gson.toJson(responseObject);
        resp.setContentType("application/json");
        resp.getWriter().write(responseText);
    }

}
