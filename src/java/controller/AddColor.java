
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Color;
import hibernate.HibernateUtil;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

@WebServlet(name = "AddColor", urlPatterns = {"/AddColor"})
public class AddColor extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();
        
        JsonObject data = gson.fromJson(req.getReader(), JsonObject.class);
        
        String color = data.get("color").getAsString();
        
        Color c = new Color();
        
        c.setValue(color);
        
        s.save(c);
        s.beginTransaction().commit();
        s.close();
        
    }

}
