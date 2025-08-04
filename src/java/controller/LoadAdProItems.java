package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.Status;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@WebServlet(name = "LoadAdProItems", urlPatterns = {"/LoadAdProItems"})
public class LoadAdProItems extends HttpServlet {

    @Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    Gson gson = new Gson();
    JsonObject responseObject = new JsonObject();
    responseObject.addProperty("status", false);

    int firstResult = 0;
    int maxResults = 10;

    try {
        if (request.getParameter("firstResult") != null) {
            firstResult = Integer.parseInt(request.getParameter("firstResult"));
        }
    } catch (NumberFormatException ignored) {}

    SessionFactory sf = HibernateUtil.getSessionFactory();
    Session s = sf.openSession();

    Criteria countCriteria = s.createCriteria(Product.class);
    int totalCount = countCriteria.list().size();

    Criteria c2 = s.createCriteria(Product.class);
    c2.addOrder(Order.desc("id"));
    c2.setFirstResult(firstResult);
    c2.setMaxResults(maxResults);

    List<Product> productList = c2.list();
    for (Product product : productList) {
        product.setUser(null);
    }

    responseObject.add("productList", gson.toJsonTree(productList));
    responseObject.addProperty("allProductCount", totalCount);
    responseObject.addProperty("status", true);

    response.setContentType("application/json");
    response.getWriter().write(gson.toJson(responseObject));
}
}
