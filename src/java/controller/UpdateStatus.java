package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.Status;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "UpdateStatus", urlPatterns = {"/UpdateStatus"})
public class UpdateStatus extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        JsonObject data = gson.fromJson(req.getReader(), JsonObject.class);

        String id = data.get("id").getAsString();

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //validation
        if (req.getSession().getAttribute("admin") == null) {
            responseObject.addProperty("message", "Please sign in!");
        } else if (id.isEmpty()) {
            responseObject.addProperty("message", "Invalid product!");
        } else if (!Util.isInteger(id)) {
            responseObject.addProperty("message", "Invalid product!");
        } else {
            Criteria criteria = s.createCriteria(Product.class);
    criteria.add(Restrictions.eq("id", Integer.parseInt(id)));
    Product product = (Product) criteria.uniqueResult();

    if (product == null) {
        responseObject.addProperty("message", "Product does not exist!");
    } else {
        int currentStatusId = product.getStatus().getId();
        int newStatusId = (currentStatusId == 1) ? 2 : 1; // toggle 1 ↔ 2

        Status newStatus = (Status) s.get(Status.class, newStatusId);
        product.setStatus(newStatus);

        s.beginTransaction();
        s.update(product);
        s.getTransaction().commit();

        responseObject.addProperty("status", true);
        responseObject.addProperty(
            "message", 
            "Product status updated!"
        );
    }

        }

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(responseObject));
    }
}
